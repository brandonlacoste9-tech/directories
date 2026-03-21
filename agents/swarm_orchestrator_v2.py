#!/usr/bin/env python3
"""
REGISTRE_LOI96 — SWARM ORCHESTRATOR v2.0
=========================================
Pro-Tier hardening:
  - asyncio-based concurrent agent execution (replaces subprocess blocking)
  - Exponential backoff retry with jitter for all HTTP calls
  - Dead-letter queue (DLQ) for failed tasks persisted to disk
  - Structured JSON logging to stdout (compatible with Vercel/Datadog)
  - Graceful shutdown via SIGINT/SIGTERM with cleanup
  - Heartbeat ping to the Next.js /api/swarm/status endpoint
"""

import asyncio
import json
import logging
import os
import random
import signal
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import aiohttp

# ─── Configuration ─────────────────────────────────────────────────────────

APP_URL        = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
OPENCLAW_PORT  = int(os.getenv("OPENCLAW_PORT", "18789"))
DLQ_PATH       = Path(__file__).parent / "dlq.json"
MEMORY_PATH    = Path(__file__).parent / "memory.json"
MAX_RETRIES    = 5
BASE_BACKOFF   = 1.0   # seconds
MAX_BACKOFF    = 60.0  # seconds
HEARTBEAT_INTERVAL = 30  # seconds

# ─── Structured Logger ─────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format='{"time": "%(asctime)s", "level": "%(levelname)s", "agent": "%(name)s", "msg": %(message)s}',
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)
log = logging.getLogger("ORCHESTRATOR_V2")


# ─── Retry Utility ─────────────────────────────────────────────────────────

async def with_retry(
    coro_fn,
    *args,
    max_retries: int = MAX_RETRIES,
    label: str = "task",
    **kwargs,
) -> Optional[Any]:
    """Execute an async coroutine with exponential backoff and jitter."""
    for attempt in range(1, max_retries + 1):
        try:
            return await coro_fn(*args, **kwargs)
        except Exception as exc:
            if attempt == max_retries:
                log.error(f'"label": "{label}", "attempt": {attempt}, "error": "{exc}", "status": "DLQ"')
                await push_to_dlq(label, str(exc))
                return None
            backoff = min(BASE_BACKOFF * (2 ** (attempt - 1)) + random.uniform(0, 1), MAX_BACKOFF)
            log.warning(f'"label": "{label}", "attempt": {attempt}, "error": "{exc}", "retry_in": {backoff:.2f}')
            await asyncio.sleep(backoff)
    return None


# ─── Dead-Letter Queue ─────────────────────────────────────────────────────

async def push_to_dlq(task_label: str, error: str) -> None:
    """Persist failed tasks to disk for manual inspection / replay."""
    dlq: list = []
    if DLQ_PATH.exists():
        try:
            dlq = json.loads(DLQ_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, IOError):
            dlq = []
    dlq.append({
        "task":      task_label,
        "error":     error,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    # Keep last 500 entries
    DLQ_PATH.write_text(json.dumps(dlq[-500:], indent=2), encoding="utf-8")


# ─── Neon API Bridge ───────────────────────────────────────────────────────

async def post_swarm_event(
    session: aiohttp.ClientSession,
    event_type: str,
    action: str,
    slug: Optional[str] = None,
    business_data: Optional[dict] = None,
) -> None:
    """Push a swarm event to the Next.js /api/swarm/deploy endpoint."""
    payload = {
        "eventType":    event_type,
        "action":       action,
        "slug":         slug,
        "businessData": business_data,
    }
    url = f"{APP_URL}/api/swarm/deploy"
    async with session.post(url, json=payload, timeout=aiohttp.ClientTimeout(total=10)) as resp:
        if resp.status not in (200, 201):
            text = await resp.text()
            raise RuntimeError(f"HTTP {resp.status}: {text[:200]}")
    log.info(f'"event": "{event_type}", "action": "{action}", "slug": "{slug}", "status": "LOGGED"')


# ─── Agent Workers ─────────────────────────────────────────────────────────

SECTORS = [
    "Construction", "Plomberie", "HVAC", "Nettoyage",
    "Technologie", "Hospitalité", "Commerce", "Services",
]

async def sweeper_agent(session: aiohttp.ClientSession, agent_id: int) -> None:
    """Linguistic Scout — discovers new leads and logs them to Neon."""
    sector = SECTORS[agent_id % len(SECTORS)]
    log.info(f'"agent": "SWEEPER-{agent_id}", "sector": "{sector}", "status": "SCANNING"')

    # Simulate discovery (replace with browser_use_lead_gen in production)
    leads = [
        {"name": f"{sector} Solutions Pro", "domain": f"{sector.lower()}-solutions-pro.ca", "riskScore": 70},
        {"name": f"Groupe {sector} Montréal", "domain": f"groupe-{sector.lower()}-mtl.com", "riskScore": 85},
    ]

    for lead in leads:
        slug = lead["name"].lower().replace(" ", "-").replace("é", "e").replace("î", "i")
        await with_retry(
            post_swarm_event,
            session,
            "LEAD_DISCOVERED",
            f"SCOUT:{sector}",
            slug,
            {
                "id":        f"LOI96-{abs(hash(slug)) % 99999:05X}",
                "name":      lead["name"],
                "category":  sector.upper(),
                "slug":      slug,
                "domain":    lead["domain"],
                "riskLevel": "HIGH" if lead["riskScore"] >= 70 else "MODERATE",
                "riskScore": lead["riskScore"],
                "violations": [
                    "MISSING_FR_LEGAL: English-only Terms/Privacy.",
                    "BILL_96_GAP: Client portal lacks French gateway.",
                ],
                "isOutreachSent": False,
            },
            label=f"SWEEPER-{agent_id}:LEAD:{slug}",
        )
        await asyncio.sleep(0.5)


async def diplomat_agent(session: aiohttp.ClientSession, agent_id: int) -> None:
    """Response Diplomat — logs outreach dispatch events to Neon."""
    log.info(f'"agent": "DIPLOMAT-{agent_id}", "status": "MONITORING"')
    await with_retry(
        post_swarm_event,
        session,
        "OUTREACH_DISPATCHED",
        f"DIPLOMAT-{agent_id}:SCAN",
        label=f"DIPLOMAT-{agent_id}",
    )


async def monitor_agent(session: aiohttp.ClientSession, agent_id: int) -> None:
    """Response Monitor — watches for inbound replies."""
    log.info(f'"agent": "MONITOR-{agent_id}", "status": "LISTENING"')
    await with_retry(
        post_swarm_event,
        session,
        "MONITOR_HEARTBEAT",
        f"MONITOR-{agent_id}:ACTIVE",
        label=f"MONITOR-{agent_id}",
    )


# ─── Heartbeat ─────────────────────────────────────────────────────────────

async def heartbeat_loop(session: aiohttp.ClientSession) -> None:
    """Periodically ping the Next.js status endpoint to confirm liveness."""
    while True:
        try:
            async with session.get(
                f"{APP_URL}/api/swarm/status",
                timeout=aiohttp.ClientTimeout(total=5),
            ) as resp:
                if resp.status == 200:
                    log.info('"heartbeat": "OK"')
                else:
                    log.warning(f'"heartbeat": "DEGRADED", "status": {resp.status}')
        except Exception as exc:
            log.warning(f'"heartbeat": "FAILED", "error": "{exc}"')
        await asyncio.sleep(HEARTBEAT_INTERVAL)


# ─── Main Orchestrator ─────────────────────────────────────────────────────

async def run_swarm(
    num_sweepers: int = 4,
    num_monitors: int = 2,
    num_diplomats: int = 1,
) -> None:
    """Spawn all agent coroutines concurrently and supervise them."""
    log.info(f'"status": "SWARM_LAUNCH", "sweepers": {num_sweepers}, "monitors": {num_monitors}, "diplomats": {num_diplomats}')

    connector = aiohttp.TCPConnector(limit=20)
    async with aiohttp.ClientSession(connector=connector) as session:
        # Build the task list
        tasks = []

        # Heartbeat
        tasks.append(asyncio.create_task(heartbeat_loop(session), name="HEARTBEAT"))

        # Sweepers (run once per cycle, then restart)
        for i in range(num_sweepers):
            tasks.append(asyncio.create_task(sweeper_agent(session, i + 1), name=f"SWEEPER-{i+1}"))

        for i in range(num_monitors):
            tasks.append(asyncio.create_task(monitor_agent(session, i + 1), name=f"MONITOR-{i+1}"))

        for i in range(num_diplomats):
            tasks.append(asyncio.create_task(diplomat_agent(session, i + 1), name=f"DIPLOMAT-{i+1}"))

        # Supervisor loop — restart crashed agents
        while True:
            done, pending = await asyncio.wait(tasks, timeout=60, return_when=asyncio.FIRST_COMPLETED)

            for task in done:
                name = task.get_name()
                if task.exception():
                    log.error(f'"agent": "{name}", "status": "CRASHED", "error": "{task.exception()}"')
                else:
                    log.info(f'"agent": "{name}", "status": "COMPLETED"')

                # Restart non-heartbeat agents
                if name != "HEARTBEAT":
                    tasks.remove(task)
                    agent_type, agent_id_str = name.split("-")[0], name.split("-")[1]
                    agent_id = int(agent_id_str)
                    if agent_type == "SWEEPER":
                        new_task = asyncio.create_task(sweeper_agent(session, agent_id), name=name)
                    elif agent_type == "MONITOR":
                        new_task = asyncio.create_task(monitor_agent(session, agent_id), name=name)
                    else:
                        new_task = asyncio.create_task(diplomat_agent(session, agent_id), name=name)
                    tasks.append(new_task)
                    log.info(f'"agent": "{name}", "status": "RESTARTED"')

            await asyncio.sleep(5)


def main() -> None:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    def shutdown(sig, frame):
        log.info(f'"status": "SHUTDOWN", "signal": "{sig}"')
        for task in asyncio.all_tasks(loop):
            task.cancel()
        loop.stop()

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        loop.run_until_complete(run_swarm(num_sweepers=4, num_monitors=2, num_diplomats=1))
    except asyncio.CancelledError:
        pass
    finally:
        loop.close()
        log.info('"status": "SWARM_OFFLINE"')


if __name__ == "__main__":
    main()
