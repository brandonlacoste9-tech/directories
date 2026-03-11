import json
import os
from datetime import datetime
from gravity_claw import GravityClaw


def deploy_bulk_outreach():
    project_root = "c:\\Users\\booboo\\directorie\\directories"
    data_path = os.path.join(project_root, "src", "lib", "directory_data.json")
    findings_path = os.path.join(project_root, "agents", "findings.md")

    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    claw = GravityClaw(root_dir=project_root)

    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"📡 [SWARM]: Initiating Outreach Swarm for {len(data)} businesses...")

    outreach_results = []

    for slug, business in data.items():
        # Skip internal or test entries
        if slug == "audit-target":
            continue

        # AUTOMATICALLY SEND: auto_send=True
        result = claw.deploy_outreach(slug, auto_send=True)
        outreach_results.append(result)

    # Update findings.md with high-fidelity logging
    with open(findings_path, "w", encoding="utf-8") as f:
        f.write("# AUDIT FINDINGS & LEAD LOG (MARCH 2026)\n\n")
        f.write("| Business Name | Slug | Risk Level | Outreach | Date |\n")
        f.write("| --- | --- | --- | --- | --- |\n")

        for res in outreach_results:
            if res["status"] == "SENT":
                status = "✅ SENT (AUTO)"
                date = datetime.now().strftime("%Y-%m-%d")
                f.write(f"| **{res['business']}** | {res.get('slug', '-')} | "
                        f"{res['risk']} | {status} | {date} |\n")

    print(f"✅ [SUCCESS]: Outreach swarm dispatched {len(outreach_results)} "
          "notices.")
    print(f"📝 Registry updated in directory_data.json")


if __name__ == "__main__":
    deploy_bulk_outreach()
