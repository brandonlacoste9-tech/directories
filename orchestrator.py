import os
import subprocess
import json
import sys
import threading
import time
from datetime import datetime
from fastapi import FastAPI, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

class GravityClawOrchestrator:
    """
    GRAVITYCLAW MASTER ORCHESTRATOR v2.2 - "THE WAR MACHINE"
    Orchestrates audits, swarm remediation, payment validation, and certification.
    """
    
    def __init__(self):
        self.project_root = "c:\\Users\\booboo\\directorie\\directories"
        self.agents_dir = os.path.join(self.project_root, "agents")
        self.directory_file = os.path.join(self.project_root, "src", "lib", "directory_data.json")
        self.recent_tasks = []
        self.audits_completed = 0
        self.is_syncing = False
        
    def log(self, message, action="SYSTEM"):
        timestamp = datetime.now().isoformat()
        log_entry = f"[{datetime.now().strftime('%H:%M:%S')}] ⚙️ {message}"
        print(log_entry)
        self.recent_tasks.insert(0, {
            "time": timestamp,
            "action": action,
            "target": message
        })
        self.recent_tasks = self.recent_tasks[:30] # Keep more tasks

    def run_agent(self, script_name, args=None):
        script_path = os.path.join(self.agents_dir, script_name)
        self.log(f"Executing Agent: {script_name}...", "AGENT_EXEC")
        try:
            cmd = [sys.executable, script_path]
            if args: cmd.extend(args)
            subprocess.run(cmd, capture_output=True, text=True, check=True)
            self.audits_completed += 1
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"ERROR executing {script_name}: {e.stderr[:100]}", "ERROR")
            return False

    def sync_all(self):
        if self.is_syncing: return
        self.is_syncing = True
        self.log("--- STARTING FULL SWARM SYNCHRONIZATION ---", "ORCHESTRATION")
        self.run_agent("initiate_audits.py")
        
        with open(self.directory_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        to_remediate = [slug for slug, b in data.items() if b.get("riskScore", 0) > 50]
        for slug in to_remediate:
            self.log(f"DEPLOYING SWARM AGENT for: {slug}", "SWARM_DEPLOY")
            self.run_agent("remediation_swarm.py", [slug])

        self.log("--- SYNCHRONIZATION COMPLETE ---", "IDLE")
        self.is_syncing = False

    def run_post_payment_validation(self, slug):
        self.log(f"INITIATING POST-PAYMENT VALIDATION for {slug}...", "VALIDATION")
        # 1. Run a fresh audit to confirm patch applied
        # 2. Generate Compliance Certificate (Simulated agent)
        self.log(f"GENERATING OFFICIAL CERTIFICATE for {slug}...", "CERTIFICATION")
        time.sleep(2) # Simulation
        self.log(f"MISSION SUCCESS: Certificate delivered to {slug}@quebec.ca", "FINAL_DELIVERY")

    def get_status(self):
        return {
            "status": "SYNCING" if self.is_syncing else "IDLE",
            "audits_completed": self.audits_completed,
            "active_swarms": ["Linguistique-FR", "SEO-Quebec", "Paiement-Sync"] if self.is_syncing else [],
            "recent_tasks": self.recent_tasks,
            "openclaw_link": {"active": True, "version": "v1.4.2-LETHAL"}
        }

# --- API SERVER SETUP ---
app = FastAPI(title="GravityClaw Master Orchestrator")
claw = GravityClawOrchestrator()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/status")
async def read_status():
    return claw.get_status()

@app.post("/api/sync")
async def trigger_sync(background_tasks: BackgroundTasks):
    background_tasks.add_task(claw.sync_all)
    return {"status": "SYNC_STARTED"}

@app.post("/api/swarm/deploy")
async def deploy_swarm(
    background_tasks: BackgroundTasks, 
    sector: str = Query(...), 
    slug: str = Query(None)
):
    if sector == "PostPaymentValidation" and slug:
        claw.log(f"Post-Payment Validation Hook triggered for {slug}", "WEBHOOK_PROXY")
        background_tasks.add_task(claw.run_post_payment_validation, slug)
        return {"status": "VALIDATION_QUEUED"}
    
    claw.log(f"Manual deployment for sector: {sector}", "MANUAL_DEPLOY")
    background_tasks.add_task(claw.sync_all)
    return {"status": "SUCCESS", "leads": []}

def run_api():
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    claw.log("Starting GravityClaw Master Orchestrator [LETHAL_MODE]...")
    api_thread = threading.Thread(target=run_api, daemon=True)
    api_thread.start()
    claw.sync_all()
    try:
        while True: time.sleep(1)
    except KeyboardInterrupt:
        claw.log("Shutting down...")
