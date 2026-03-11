import requests
import json
import time
import sys

# GRAVITYCLAW MISSION STRESS TESTER v1.0
# Simulates multiple Stripe checkout completions to verify 
# automated conformity flips and backend validation.

WEBHOOK_URL = "http://localhost:3000/api/webhooks/stripe"
ORCHESTRATOR_URL = "http://localhost:8000/api/status"

TARGETS = [
    "plomberie-montréal-inc",
    "tech-solutions-laval",
    "construction-jean-paul",
    "groupe-cleaning-montreal-high"
]

def simulate_webhook_payment(slug):
    print(f"[TEST]: Simulating payment completion for {slug}...")
    
    # Mock Stripe Event Object
    payload = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": f"cs_test_{int(time.time())}",
                "metadata": {
                    "slug": slug
                }
            }
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "x-gravityclaw-simulation": "LETHAL" # Our bypass header
    }
    
    try:
        response = requests.post(WEBHOOK_URL, json=payload, headers=headers)
        if response.status_code == 200:
            print(f"[SUCCESS]: Webhook processed for {slug}.")
        else:
            print(f"[FAILED]: Webhook returned {response.status_code}: {response.text}")
    except Exception as e:
        print(f"[ERROR]: Request failed: {e}")

def check_orchestrator_logs():
    try:
        res = requests.get(ORCHESTRATOR_URL)
        status = res.json()
        print("\n--- RECENT ORCHESTRATOR TASKS ---")
        for task in status.get("recent_tasks", [])[:10]:
            print(f"[{task['action']}] {task['target']}")
    except:
        print("[ERROR]: Could not reach Orchestrator.")

if __name__ == "__main__":
    print("=== SENTINELLE-96 MASS PAYMENT SIMULATION ===")
    
    for slug in TARGETS:
        simulate_webhook_payment(slug)
        time.sleep(1) # Small gap between events
        
    print("\nSimulation Finished. Verifying status in 2 seconds...")
    time.sleep(2)
    check_orchestrator_logs()
    
    print("\n[VERIFICATION]: Check directory_data.json manually to confirm flips.")
