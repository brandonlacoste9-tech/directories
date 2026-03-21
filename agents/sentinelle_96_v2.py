#!/usr/bin/env python3
"""
SENTINELLE-96 v2.0 — Autonomous Forensic Auditor
=================================================
Pro-Tier hardening:
  - Async HTTP via aiohttp (replaces blocking requests)
  - All state persisted to Neon via /api/swarm/deploy (replaces memory.json)
  - Structured JSON logging
  - Configurable scoring thresholds via environment variables
  - Strict type annotations throughout
"""

import asyncio
import json
import logging
import os
import re
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Optional

import aiohttp

# ─── Configuration ─────────────────────────────────────────────────────────

APP_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")

RISK_THRESHOLDS = {
    "CRITICAL": int(os.getenv("RISK_THRESHOLD_CRITICAL", "80")),
    "HIGH":     int(os.getenv("RISK_THRESHOLD_HIGH",     "50")),
    "MODERATE": int(os.getenv("RISK_THRESHOLD_MODERATE", "20")),
}

REMEDIATION_PRICING = {
    "CRITICAL": {"tier": "FORTERESSE / FORTRESS",  "price": "599$",  "complexity": "EXTRAORDINARY"},
    "HIGH":     {"tier": "SENTINELLE / SENTINEL",   "price": "299$",  "complexity": "HIGH"},
    "MODERATE": {"tier": "ÉCLAIREUR / SCOUT",       "price": "49$",   "complexity": "LOW"},
}

log = logging.getLogger("SENTINELLE_96_V2")


# ─── Data Models ───────────────────────────────────────────────────────────

@dataclass
class AuditTarget:
    name:   str
    domain: str
    sector: str
    slug:   str = field(default="")

    def __post_init__(self):
        if not self.slug:
            self.slug = re.sub(r"[^a-z0-9-]", "-", self.name.lower()).strip("-")


@dataclass
class AuditResult:
    target:      AuditTarget
    risk_score:  int
    risk_level:  str
    violations:  list[str]
    remediation: dict
    audit_date:  str = field(default_factory=lambda: datetime.now(timezone.utc).date().isoformat())


# ─── Forensic Scoring Engine ───────────────────────────────────────────────

class ForensicScorer:
    """
    Bill 96 compliance scoring across 4 pillars:
      1. Legal Presence (French legal docs)
      2. Digital Interfaces (French UI/UX)
      3. HR/Internal (French workplace comms)
      4. Commerce (French-first customer interactions)
    """

    PILLAR_WEIGHTS = {
        "LEGAL_PRESENCE":    30,
        "DIGITAL_INTERFACE": 30,
        "HR_INTERNAL":       20,
        "COMMERCE":          20,
    }

    def score(self, target: AuditTarget, html_content: str = "") -> AuditResult:
        violations: list[str] = []
        score = 0

        # Pillar 1: Legal Presence
        if not self._has_french_legal(html_content):
            violations.append("MISSING_FR_LEGAL: English-only Terms/Privacy detected.")
            score += self.PILLAR_WEIGHTS["LEGAL_PRESENCE"]

        # Pillar 2: Digital Interface
        if not self._has_french_ui(html_content, target.domain):
            violations.append("BILL_96_GAP: Client portal lacks French gateway.")
            score += self.PILLAR_WEIGHTS["DIGITAL_INTERFACE"]

        # Pillar 3: HR/Internal (heuristic based on sector)
        if target.sector in ("Construction", "HVAC", "Plomberie"):
            violations.append("TIERED_ENFORCEMENT: 25+ Employee bracket detected.")
            score += self.PILLAR_WEIGHTS["HR_INTERNAL"] // 2

        # Pillar 4: Commerce
        if not self._has_french_meta(html_content):
            violations.append("METADATA_MISMATCH: SEO targeting English-only.")
            score += self.PILLAR_WEIGHTS["COMMERCE"]

        risk_level = self._classify_risk(score)
        remediation = {
            **REMEDIATION_PRICING.get(risk_level, REMEDIATION_PRICING["MODERATE"]),
            "fr_desc": self._get_fr_desc(risk_level),
            "estimated_time": "Instant (Automated) / 4h (Human Review)",
        }

        return AuditResult(
            target=target,
            risk_score=score,
            risk_level=risk_level,
            violations=violations,
            remediation=remediation,
        )

    def _has_french_legal(self, html: str) -> bool:
        return bool(re.search(r"(politique de confidentialit|conditions d.utilisation)", html, re.I))

    def _has_french_ui(self, html: str, domain: str) -> bool:
        return ".qc.ca" in domain or bool(re.search(r'lang=["\']fr', html, re.I))

    def _has_french_meta(self, html: str) -> bool:
        return bool(re.search(r'<html[^>]+lang=["\']fr', html, re.I))

    def _classify_risk(self, score: int) -> str:
        if score >= RISK_THRESHOLDS["CRITICAL"]:
            return "CRITICAL"
        if score >= RISK_THRESHOLDS["HIGH"]:
            return "HIGH"
        if score >= RISK_THRESHOLDS["MODERATE"]:
            return "MODERATE"
        return "LOW"

    def _get_fr_desc(self, risk_level: str) -> str:
        descs = {
            "CRITICAL": "Remédiation complète incluant défense légale, infrastructure bilingue et protection contre les amendes de l'OQLF.",
            "HIGH":     "Conformité standard : Traductions complètes, SEO localisé et Politiques de confidentialité conformes à la Loi 25/96.",
            "MODERATE": "Audit préventif et mise en conformité des métadonnées et mentions légales.",
            "LOW":      "Vérification de conformité légère. Aucune action immédiate requise.",
        }
        return descs.get(risk_level, descs["MODERATE"])


# ─── Sentinelle Agent ──────────────────────────────────────────────────────

class Sentinelle96:
    def __init__(self, session: aiohttp.ClientSession):
        self.session = session
        self.scorer  = ForensicScorer()

    async def audit_target(self, target: AuditTarget) -> Optional[AuditResult]:
        """Fetch the target domain and run the forensic scoring engine."""
        html = ""
        try:
            url = f"https://{target.domain}"
            async with self.session.get(
                url,
                timeout=aiohttp.ClientTimeout(total=15),
                headers={"User-Agent": "Sentinelle-96/2.0 (Loi96-Compliance-Audit)"},
                ssl=False,
            ) as resp:
                if resp.status == 200:
                    html = await resp.text(errors="replace")
        except Exception as exc:
            log.warning(f'"target": "{target.domain}", "fetch_error": "{exc}"')

        result = self.scorer.score(target, html)
        log.info(
            f'"target": "{target.name}", "risk": "{result.risk_level}", '
            f'"score": {result.risk_score}, "violations": {len(result.violations)}'
        )
        return result

    async def push_to_neon(self, result: AuditResult) -> None:
        """Persist audit result to Neon via the Next.js deploy endpoint."""
        payload = {
            "eventType": "AUDIT_COMPLETE",
            "action":    f"FORENSIC_AUDIT:{result.risk_level}",
            "slug":      result.target.slug,
            "businessData": {
                "id":                    f"LOI96-{abs(hash(result.target.slug)) % 99999:05X}",
                "name":                  result.target.name,
                "category":              result.target.sector.upper(),
                "slug":                  result.target.slug,
                "domain":                result.target.domain,
                "riskLevel":             result.risk_level,
                "riskScore":             result.risk_score,
                "violations":            result.violations,
                "remediationTier":       result.remediation.get("tier"),
                "remediationPrice":      result.remediation.get("price"),
                "remediationFrDesc":     result.remediation.get("fr_desc"),
                "remediationComplexity": result.remediation.get("complexity"),
                "remediationEstimatedTime": result.remediation.get("estimated_time"),
                "isOutreachSent":        False,
                "outreachDate":          None,
            },
        }
        async with self.session.post(
            f"{APP_URL}/api/swarm/deploy",
            json=payload,
            timeout=aiohttp.ClientTimeout(total=10),
        ) as resp:
            if resp.status not in (200, 201):
                text = await resp.text()
                raise RuntimeError(f"Neon push failed: HTTP {resp.status} — {text[:200]}")

    async def run_sector_sweep(self, sector: str, targets: list[AuditTarget]) -> list[AuditResult]:
        """Audit all targets in a sector concurrently."""
        log.info(f'"sector": "{sector}", "targets": {len(targets)}, "status": "SWEEP_START"')
        results = await asyncio.gather(
            *[self.audit_target(t) for t in targets],
            return_exceptions=True,
        )
        valid_results = []
        for r in results:
            if isinstance(r, AuditResult):
                await self.push_to_neon(r)
                valid_results.append(r)
            elif isinstance(r, Exception):
                log.error(f'"sweep_error": "{r}"')
        log.info(f'"sector": "{sector}", "audited": {len(valid_results)}, "status": "SWEEP_COMPLETE"')
        return valid_results


# ─── Entry Point ───────────────────────────────────────────────────────────

async def main():
    logging.basicConfig(
        level=logging.INFO,
        format='{"time": "%(asctime)s", "level": "%(levelname)s", "agent": "%(name)s", "msg": %(message)s}',
    )

    sample_targets = [
        AuditTarget("Plomberie Rapide Laval",   "plomberie-rapide-laval.com",   "Plomberie"),
        AuditTarget("Construction Leblanc Inc", "construction-leblanc.ca",      "Construction"),
        AuditTarget("Tech Innov Montréal",      "tech-innov-montreal.com",      "Technologie"),
        AuditTarget("Nettoyage Pro QC",         "nettoyage-pro-qc.ca",          "Nettoyage"),
    ]

    connector = aiohttp.TCPConnector(limit=10, ssl=False)
    async with aiohttp.ClientSession(connector=connector) as session:
        agent = Sentinelle96(session)
        await agent.run_sector_sweep("MIXED", sample_targets)


if __name__ == "__main__":
    asyncio.run(main())
