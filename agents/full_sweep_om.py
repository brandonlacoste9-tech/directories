import json
import os
import sys

# Add the agents directory to path so we can import enqueue_task
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from openmanus_agent import enqueue_task

def confirm_full_sweep():
    root_dir = "c:\\Users\\booboo\\directorie\\directories"
    data_path = os.path.join(root_dir, "src", "lib", "directory_data.json")
    
    if not os.path.exists(data_path):
        print(f"❌ Error: {data_path} not found.")
        return

    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Filter for high-risk businesses (Score >= 70)
    high_risk = []
    for key, biz in data.items():
        if biz.get("riskScore", 0) >= 70:
            high_risk.append(biz)
    
    # Sort by score descending
    high_risk.sort(key=lambda x: x.get("riskScore", 0), reverse=True)
    
    # Limit to top 10 for the "Deep Audit" sweep to prevent resource exhaustion
    sweep_targets = high_risk[:10]
    
    print(f"🔍 [SWEEP]: Identified {len(high_risk)} high-risk targets. Enqueuing top {len(sweep_targets)} for Deep AI Audit...")

    for biz in sweep_targets:
        name = biz.get("name", "Unknown")
        domain = biz.get("domain", "")
        if not domain:
            continue
            
        prompt = (
            f"Audite le site web '{domain}' ({name}) pour vérifier la conformité à la Loi 96 du Québec. "
            f"Identifie au moins 3 sources de non-conformité (ex: menus en anglais, manque de bascule de langue, "
            f"CGU non traduites). Fournis un rapport détaillé en français avec des recommandations."
        )
        
        task_id = f"SWEEP_{biz.get('id', 'UNK')}"
        enqueue_task(root_dir, prompt, domain=domain, task_id=task_id)
        
    print(f"✅ [SWEEP]: Enqueued {len(sweep_targets)} tasks for the OpenManus Brain.")

if __name__ == "__main__":
    confirm_full_sweep()
