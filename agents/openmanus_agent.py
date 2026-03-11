import os
import json
import time
import subprocess
import sys
from datetime import datetime
from gravity_claw import GravityClaw

# ZYEUTÉ × OPENMANUS BRIDGE AGENT
# Mission: Escalate complex tasks from the swarm to OpenManus for deep AI execution.
# OpenManus handles: web research, full remediation plans, multi-step browser tasks.

OPENMANUS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "OpenManus"
)
OPENMANUS_PYTHON = os.path.join(OPENMANUS_DIR, ".venv", "Scripts", "python.exe")


class OpenManusAgent:
    def __init__(self, root_dir: str):
        self.root_dir = root_dir
        self.claw = GravityClaw(root_dir=root_dir)
        self.is_running = True
        self.task_queue_file = os.path.join(root_dir, "agents", "openmanus_tasks.json")
        self.results_file = os.path.join(root_dir, "agents", "openmanus_results.json")

        # Initialize task queue if it doesn't exist
        if not os.path.exists(self.task_queue_file):
            with open(self.task_queue_file, "w", encoding="utf-8") as f:
                json.dump([], f)

        if not os.path.exists(self.results_file):
            with open(self.results_file, "w", encoding="utf-8") as f:
                json.dump([], f)

    def read_task_queue(self):
        """Read pending tasks from the shared queue."""
        for _ in range(5):
            try:
                with open(self.task_queue_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                time.sleep(0.3)
        return []

    def save_task_queue(self, tasks: list):
        """Save the updated task queue."""
        for _ in range(5):
            try:
                with open(self.task_queue_file, "w", encoding="utf-8") as f:
                    json.dump(tasks, f, indent=2, ensure_ascii=False)
                return
            except Exception:
                time.sleep(0.3)

    def save_result(self, task_id: str, prompt: str, result: str, status: str):
        """Append the OpenManus execution result to the results log."""
        results = []
        if os.path.exists(self.results_file):
            try:
                with open(self.results_file, "r", encoding="utf-8") as f:
                    results = json.load(f)
            except Exception:
                pass

        results.append({
            "task_id": task_id,
            "prompt": prompt,
            "result": result[:2000],  # cap at 2000 chars
            "status": status,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "agent": "OPENMANUS_BRIDGE_01"
        })

        for _ in range(5):
            try:
                with open(self.results_file, "w", encoding="utf-8") as f:
                    json.dump(results, f, indent=2, ensure_ascii=False)
                return
            except Exception:
                time.sleep(0.3)

    def dispatch_to_openmanus(self, prompt: str, timeout: int = 120) -> str:
        """
        Send a prompt to OpenManus and capture the output.
        Uses a one-shot subprocess invocation with the prompt piped in.
        """
        print(f"🧠 [OPENMANUS]: Dispatching task → {prompt[:80]}...")

        # Build a one-shot runner script that feeds the prompt and exits
        runner_script = os.path.join(OPENMANUS_DIR, "_swarm_runner.py")
        runner_code = f"""
import asyncio
import sys
import os
sys.path.insert(0, r'{OPENMANUS_DIR}')
os.chdir(r'{OPENMANUS_DIR}')

from app.agent.manus import Manus

async def run():
    agent = await Manus.create()
    prompt = {repr(prompt)}
    result = await agent.run(prompt)
    print("=== OPENMANUS_RESULT_START ===")
    print(result)
    print("=== OPENMANUS_RESULT_END ===")
    await agent.cleanup()

asyncio.run(run())
"""
        with open(runner_script, "w", encoding="utf-8") as f:
            f.write(runner_code)

        try:
            proc = subprocess.run(
                [OPENMANUS_PYTHON, runner_script],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=OPENMANUS_DIR
            )

            output = proc.stdout + proc.stderr

            # Extract result between markers
            if "=== OPENMANUS_RESULT_START ===" in output:
                start = output.find("=== OPENMANUS_RESULT_START ===") + len("=== OPENMANUS_RESULT_START ===")
                end = output.find("=== OPENMANUS_RESULT_END ===")
                return output[start:end].strip()
            else:
                return output.strip()[-1000:] if output.strip() else "No output from OpenManus."

        except subprocess.TimeoutExpired:
            return f"⏱️ OpenManus task timed out after {timeout}s."
        except Exception as e:
            return f"❌ OpenManus dispatch error: {str(e)}"
        finally:
            # Clean up the temp runner
            if os.path.exists(runner_script):
                os.remove(runner_script)

    def run(self):
        print("🧠 [OPENMANUS_BRIDGE]: AGENT ONLINE — Watching task queue...")
        print(f"   Queue: {self.task_queue_file}")
        print(f"   Results: {self.results_file}")
        print("---------------------------------------")

        while self.is_running:
            try:
                tasks = self.read_task_queue()
                pending = [t for t in tasks if t.get("status") == "PENDING"]

                if pending:
                    # Process the oldest pending task
                    task = pending[0]
                    task_id = task.get("id", "unknown")
                    prompt = task.get("prompt", "")
                    domain = task.get("domain", "unknown")

                    print(f"⚙️  [OPENMANUS_BRIDGE]: Processing task [{task_id}] for {domain}")

                    # Mark as in-progress
                    task["status"] = "IN_PROGRESS"
                    task["started_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    self.save_task_queue(tasks)

                    # Dispatch to OpenManus
                    result = self.dispatch_to_openmanus(prompt)

                    # Mark as done
                    task["status"] = "DONE"
                    task["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    self.save_task_queue(tasks)

                    # Save result
                    self.save_result(task_id, prompt, result, "DONE")

                    # Log to GravityClaw
                    self.claw.prying_action(domain, f"OPENMANUS_TASK_COMPLETED_{task_id}")

                    print(f"✅ [OPENMANUS_BRIDGE]: Task [{task_id}] complete.")
                    print(f"   Result preview: {result[:200]}...")

                else:
                    print(f"💤 [OPENMANUS_BRIDGE]: No pending tasks. Sleeping 30s...")

            except Exception as e:
                print(f"❌ [OPENMANUS_BRIDGE_ERR]: {str(e)}")

            time.sleep(30)


def enqueue_task(root_dir: str, prompt: str, domain: str = "general", task_id: str = None) -> str:
    """
    Helper function: Add a task to the OpenManus queue from anywhere in the swarm.
    Returns the task ID.
    """
    queue_file = os.path.join(root_dir, "agents", "openmanus_tasks.json")
    tasks = []
    if os.path.exists(queue_file):
        try:
            with open(queue_file, "r", encoding="utf-8") as f:
                tasks = json.load(f)
        except Exception:
            pass

    if not task_id:
        task_id = f"OM_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{domain[:8]}"

    tasks.append({
        "id": task_id,
        "prompt": prompt,
        "domain": domain,
        "status": "PENDING",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    with open(queue_file, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2, ensure_ascii=False)

    print(f"📥 [QUEUE]: Task [{task_id}] added to OpenManus queue.")
    return task_id


if __name__ == "__main__":
    project_root = "c:\\Users\\booboo\\directorie\\directories"
    agent = OpenManusAgent(root_dir=project_root)
    agent.run()
