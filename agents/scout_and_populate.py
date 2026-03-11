# agents/scout_and_populate.py
import json
import os
import uuid
import datetime

# 2026 ZYEUTÉ SWARM AGENT: Scout & Populate
# Reads findings.md and creates high-fidelity business profile data for the mass directory.

FINDINGS_FILE = "agents/findings.md"
DIRECTORY_DATA_PATH = "src/lib/directory_data.json"


def parse_findings():
    """Extract business leads from the findings.md markdown table."""
    leads = []
    if not os.path.exists(FINDINGS_FILE):
        return leads

    with open(FINDINGS_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for line in lines:
        if (
            "|" in line and "plomberie" in line.lower() or "tech" in line.lower()
        ):  # Basic filter for table rows
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 6:
                leads.append(
                    {
                        "name": parts[1].replace("**", ""),
                        "neq": parts[2],
                        "domain": parts[3],
                        "employees": parts[4],
                        "risk": parts[5]
                        .replace("**", "")
                        .replace("✅", "")
                        .replace("❌", "")
                        .strip(),
                    }
                )
    return leads


def populate_site():
    leads = parse_findings()
    print(f"SWARM_SYNC: Found {len(leads)} businesses in findings log.")

    business_db = {}
    for lead in leads:
        slug = lead["name"].lower().replace(" ", "-").replace(".", "").replace(",", "")
        business_db[slug] = {
            "id": f"ZY-{uuid.uuid4().hex[:5].upper()}",
            "name": lead["name"],
            "category": "CONSTRUCTION" if "plomberie" in slug else "SERVICES",
            "slug": slug,
            "isVerified": "✅" in lead["risk"] or "CRITICAL" not in lead["risk"],
            "neq": lead["neq"],
            "loc": "QUEBEC, CA",
            "auditDate": datetime.datetime.now().strftime("%Y-%m-%d"),
        }

    os.makedirs(os.path.dirname(DIRECTORY_DATA_PATH), exist_ok=True)
    with open(DIRECTORY_DATA_PATH, "w") as f:
        json.dump(business_db, f, indent=2)

    print(f"DIRECTORY_SYNC_COMPLETE: {len(business_db)} business profiles updated.")


if __name__ == "__main__":
    populate_site()
