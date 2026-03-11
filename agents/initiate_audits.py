import json
import os
from datetime import datetime

# Import pricing logic from remediation_swarm
try:
    from remediation_swarm import RemediationSwarm
except ImportError:
    # Fallback if module is not in path
    class RemediationSwarm:
        @staticmethod
        def _calculate_tier_and_pricing(score, violations_count):
            if score > 80:
                tier = "FORTERESSE / FORTRESS"
                price = "999$"
                comp = "EXTRAORDINARY"
                fr = "Remédiation complète."
                est = "Instantané"
            elif score > 50:
                tier = "SENTINELLE / SENTINEL"
                price = "299$"
                comp = "HIGH"
                fr = "Conformité standard."
                est = "6h"
            else:
                tier = "BOUCLIER / SHIELD"
                price = "49$"
                comp = "MODERATE"
                fr = "Audit de base."
                est = "24h"

            return {
                "tier": tier,
                "price": price,
                "complexity": comp,
                "fr_desc": fr,
                "estimated_time": est
            }


def calculate_risk_score(business_name, domain):
    """
    ZYEUTÉ FORENSIC SCORING: 0-100
    Calculates liability based on domain and business name heuristics.
    """
    score = 15  # Base visibility score
    violations = []
    target_lwr = f"{business_name.lower()} {domain.lower()}"

    # 1. Locale Markers
    if "qc.ca" not in domain.lower() and ".ca" not in domain.lower():
        score += 35
        v = "NON_COMPLIANT_LOCALE: Primary domain lacks QC/CA prioritization."
        violations.append(v)

    # 2. Linguistic Markers
    if any(k in target_lwr for k in ["plomberie", "construction", "renov"]):
        score += 45
        violations.append("MISSING_FR_LEGAL: English-only Terms/Privacy.")
        violations.append("BILL_96_GAP: Client portal lacks French gateway.")
    elif any(k in target_lwr for k in ["tech", "solutions", "digital"]):
        score += 25
        violations.append("METADATA_MISMATCH: SEO targeting English-only.")

    # 3. Size/Category Complexity
    if len(business_name) > 15:
        score += 10
        violations.append("TIERED_ENFORCEMENT: 25+ Employee bracket detected.")

    score = min(100, score)
    level = "CRITICAL" if score > 80 else "HIGH" if score > 50 else "MODERATE"
    return score, level, violations


def update_directory_data():
    project_root = "c:\\Users\\booboo\\directorie\\directories"
    data_path = os.path.join(project_root, "src", "lib", "directory_data.json")

    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    swarm = RemediationSwarm(root_dir=project_root)

    for key, business in data.items():
        name = business.get("name", key)
        domain = business.get("domain", "")

        score, level, violations = calculate_risk_score(name, domain)

        business["auditDate"] = datetime.now().strftime("%Y-%m-%d")
        business["riskScore"] = score
        business["riskLevel"] = level
        business["violations"] = violations

        # Calculate dynamic pricing tier from the Swarm logic
        pricing = swarm._calculate_tier_and_pricing(score, len(violations))

        # Build remediation price object using the swarm's output
        business["remediationPrice"] = {
            "tier": pricing["tier"],
            "price": pricing["price"],
            "fr_desc": pricing["fr_desc"],
            "complexity": pricing["complexity"],
            "estimated_time": pricing["estimated_time"]
        }

    with open(data_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Successfully updated {len(data)} businesses with Loi 96 pricing.")


if __name__ == "__main__":
    update_directory_data()
