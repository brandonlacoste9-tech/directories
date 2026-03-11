import os
import json
import uuid
from datetime import datetime
from gravity_claw import Sentinelle-96
from remediation_swarm import RemediationSwarm
from initiate_audits import calculate_risk_score

def systematic_sweep():
    """
    SYSTEMATIC COMPLIANCE SWEEP v2.0
    Coalesces Scout, Audit, Pricing, and Outreach into a unified high-fidelity sweep.
    """
    project_root = "c:\\Users\\booboo\\directorie\\directories"
    claw = Sentinelle-96(root_dir=project_root)
    remedy = RemediationSwarm(root_dir=project_root)
    
    sectors = ["Construction", "Services", "Commerce", "Technologie"]
    
    print("🛸 [MASTER_SWARM]: Initiating systematic sweep of all sectors...")
    
    total_leads = []
    
    for sector in sectors:
        print(f"--- Sector: {sector} ---")
        leads = claw.scout_new_leads(sector=sector)
        
        for lead in leads:
            # 1. Audit & Score
            score, level, violations = calculate_risk_score(lead['name'], lead['domain'])
            
            # 2. Dynamic Pricing
            pricing = remedy._calculate_tier_and_pricing(score, len(violations))
            
            # 3. Generate Slug
            name_clean = lead['name'].lower().replace(" ", "-")
            slug = "".join(c for c in name_clean if c.isalnum() or c == "-")
            
            # 4. Prepare Unified Data
            business_entry = {
                "id": f"LOI96-{uuid.uuid4().hex[:5].upper()}",
                "name": lead['name'],
                "category": sector.upper(),
                "slug": slug,
                "domain": lead['domain'],
                "neq": lead['neq'],
                "isVerified": False,
                "loc": "QUEBEC, CA",
                "auditDate": datetime.now().strftime("%Y-%m-%d"),
                "riskScore": score,
                "riskLevel": level,
                "violations": violations,
                "remediationPrice": pricing
            }
            
            # 5. Sync to Directory
            claw.sync_to_directory(business_entry)
            
            # 6. Automatic Outreach
            outreach = claw.deploy_outreach(slug, auto_send=True)
            
            total_leads.append({
                "name": lead['name'],
                "slug": slug,
                "risk": level,
                "score": score,
                "pricing": pricing['price'],
                "outreach": outreach['status']
            })

    # Final Reporting to findings.md
    findings_path = os.path.join(project_root, "agents", "findings.md")
    with open(findings_path, "w", encoding="utf-8") as f:
        f.write("# REGISTRE_LOI96 SYSTEMATIC AUDIT REPORT (MARCH 2026)\n\n")
        f.write("## Execution Summary\n")
        f.write(f"- **Total Targeted**: {len(total_leads)}\n")
        f.write(f"- **Sectors Scanned**: {', '.join(sectors)}\n")
        f.write(f"- **Mode**: AUTOMATIC_OUTREACH_DISPATCH\n\n")
        
        f.write("## Detailed Results\n")
        f.write("| Enterprise | Risk | Score | Plan | Status |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- |\n")
        for lead in total_leads:
            f.write(f"| **{lead['name']}** | {lead['risk']} | {lead['score']}% | {lead['pricing']} | ✅ {lead['outreach']} |\n")

    print(f"\n✅ [SYSTEMATIC_SWEEP_COMPLETE]: Processed {len(total_leads)} entities.")
    print(f"📊 Report generated at agents/findings.md")

if __name__ == "__main__":
    systematic_sweep()
