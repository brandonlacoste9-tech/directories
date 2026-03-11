import json
import os
import time
from datetime import datetime
from gravity_claw import GravityClaw

# ZYEUTÉ AUTOMATED OUTREACH AGENT
# Mission: Scan the directory and automatically dispatch compliance notices to high-risk leads.

class OutreachAgent:
    def __init__(self, root_dir: str):
        self.root_dir = root_dir
        self.claw = GravityClaw(root_dir=root_dir)
        self.directory_file = os.path.join(root_dir, "src", "lib", "directory_data.json")
        self.is_running = True

    def run(self):
        print("🕊️ [OUTREACH_AGENT]: ONLINE — Scouting for non-compliant leads...")
        
        while self.is_running:
            try:
                if not os.path.exists(self.directory_file):
                    print(f"❌ [OUTREACH_AGENT]: Directory not found at {self.directory_file}")
                    time.sleep(60)
                    continue

                with open(self.directory_file, "r", encoding="utf-8") as f:
                    db = json.load(f)

                pending_leads = []
                for slug, biz in db.items():
                    # Criteria: High/Critical risk, not yet contacted
                    if biz.get("riskScore", 0) >= 50 and not biz.get("isOutreachSent", False):
                        pending_leads.append(slug)

                if pending_leads:
                    print(f"🎯 [OUTREACH_AGENT]: Found {len(pending_leads)} pending leads. Dispatching top 5...")
                    
                    # Batch processing to avoid rate limits/spam detection
                    for slug in pending_leads[:5]:
                        result = self.claw.deploy_outreach(slug, auto_send=True)
                        if result["status"] == "SENT":
                            print(f"✅ [OUTREACH_AGENT]: Notice sent to {result['business']}")
                        else:
                            print(f"⚠️ [OUTREACH_AGENT]: Failed to send to {slug}: {result.get('message', 'Unknown error')}")
                        
                        time.sleep(2) # Breathing room
                else:
                    print("💤 [OUTREACH_AGENT]: No new leads requiring outreach. Sleeping 5 mins...")
                    time.sleep(300)

            except Exception as e:
                print(f"❌ [OUTREACH_AGENT_ERR]: {str(e)}")
                time.sleep(60)

            # Re-check every 5 minutes
            time.sleep(300)

if __name__ == "__main__":
    project_root = "c:\\Users\\booboo\\directorie\\directories"
    agent = OutreachAgent(root_dir=project_root)
    agent.run()
