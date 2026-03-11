import os
import json
import time
from datetime import datetime
from gravity_claw import Sentinelle-96

# REGISTRE_LOI96 INBOUND NEXUS MONITOR
# Mission: Listen for business owner replies and update the directory.

def simulate_responses():
    root_dir = "c:\\Users\\booboo\\directorie\\directories"
    claw = Sentinelle-96(root_dir=root_dir)
    directory_file = os.path.join(root_dir, "src", "lib", "directory_data.json")

    print("👂 [NEXUS_MONITOR]: Listening for field responses...")
    
    while True:
        try:
            if os.path.exists(directory_file):
                db = {}
                for _ in range(5):
                    try:
                        with open(directory_file, "r", encoding="utf-8") as f:
                            db = json.load(f)
                        break
                    except (IOError, json.JSONDecodeError):
                        time.sleep(0.5)
                
                # Find a business that was SENT but not yet REPLIED
                for slug, biz in db.items():
                    status = biz.get("outreachStatus", "PENDING")
                    if status == "SENT":
                        # 20% chance of a "reply" signal in this simulation
                        import random
                        if random.random() < 0.2:
                            domain = biz.get("domain")
                            signals = ["CLICKED", "REPLIED", "CONVERTED"]
                            signal = random.choice(signals)
                            
                            content = "Interested in remediation. Please send contract." if signal == "REPLIED" else "Portal access detected."
                            
                            print(f"🔔 [NOTIFICATION]: New signal from {domain} -> {signal}")
                            claw.process_inbound_signal(domain, signal, raw_content=content)
            
            time.sleep(10) # Check every 10 seconds
        except Exception as e:
            print(f"❌ [NEXUS_ERR]: {e}")
            time.sleep(5)

if __name__ == "__main__":
    simulate_responses()
