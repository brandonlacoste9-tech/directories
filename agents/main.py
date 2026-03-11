from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import asyncio
from gravity_claw import GravityClaw
from initiate_audits import calculate_risk_score
from remediation_swarm import RemediationSwarm

app = FastAPI(title="Zyeuté Agentic API", version="2.0.0")

# Setup Paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
claw = GravityClaw(root_dir=PROJECT_ROOT)
remedy = RemediationSwarm(root_dir=PROJECT_ROOT)

origins = [
    "http://localhost:3123",
    "http://localhost:3000",
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AuditRequest(BaseModel):
    url: str
    business_name: str
    neq: str = "UNKNOWN"


@app.get("/api/status")
async def get_system_status():
    return claw.get_system_status()


@app.post("/api/audit")
async def trigger_agent_audit(request: AuditRequest):
    try:
        claw.prying_action(request.url, f"Deep_Audit_{request.business_name}")
        await asyncio.sleep(2)  # Simulate agent process

        score, level, violations = calculate_risk_score(
            request.business_name,
            request.url
        )

        result = {
            "name": request.business_name,
            "domain": request.url,
            "neq": request.neq,
            "risk": level,
            "score": score
        }
        
        # Sync to Directory
        claw.sync_to_directory(result)

        return {
            "businessName": request.business_name,
            "neq": request.neq,
            "riskLevel": level,
            "riskScore": score,
            "violations": violations,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/swarm/deploy")
async def deploy_swarm_agent(sector: str = "Construction"):
    """DEPLOYS GRAVITYCLAW SWARM: Discovery -> Audit -> Directory Sync"""
    try:
        print(f"🕵️‍♂️ [Max] Deploying Swarm: {sector}")
        leads = claw.scout_new_leads(sector=sector)
        results = []

        for lead in leads:
            score, lvl, vlns = calculate_risk_score(lead['name'], lead['domain'])
            
            # Generate slug for lead
            name_clean = lead['name'].lower().replace(" ", "-")
            slug = "".join(c for c in name_clean if c.isalnum() or c == "-")

            lead_data = {
                "name": lead['name'],
                "slug": slug,
                "domain": lead['domain'],
                "neq": lead['neq'],
                "risk": lvl,
                "score": score
            }
            
            # Sync to Directory & Memory
            claw.sync_to_directory(lead_data)
            claw.prying_action(lead['domain'], f"SWARM_AUTO_AUDIT_{lvl}")
            
            results.append(lead_data)

        return {"status": "SUCCESS", "swarmed": len(results), "leads": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/swarm/outreach")
async def deploy_outreach_swarm(business_id: str):
    """DEPLOY OUTREACH SWARM: Drafts and stages compliance notices."""
    try:
        result = claw.deploy_outreach(business_id)
        if result["status"] == "ERROR":
            raise HTTPException(status_code=404, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/lookup/deep")
async def deep_lookup_business(query: str):
    """TRIGGER DEEP SEARCH: Real-time swarm scout for unknown entities."""
    try:
        # Step 1: Scout the business identity
        scout_result = claw.deep_scout_business(query)
        
        # Step 2: Perform automated audit immediately
        score, level, violations = calculate_risk_score(
            scout_result["name"], 
            scout_result["domain"]
        )
        
        # Step 3: Sync to Directory for persistence
        result_data = {
            "name": scout_result["name"],
            "domain": scout_result["domain"],
            "neq": scout_result["neq"],
            "risk": level,
            "score": score
        }
        claw.sync_to_directory(result_data)
        
        return {
            "status": "SWARM_IDENTIFIED",
            "business": scout_result["name"],
            "riskLevel": level,
            "riskScore": score,
            "violations": violations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/swarm/remediate")
async def deploy_remediation_swarm(business_slug: str):
    """DEPLOY REMEDIATION SWARM: Generates compliance patches."""
    try:
        result = remedy.generate_compliance_patch(business_slug)
        if result["status"] == "ERROR":
            raise HTTPException(status_code=404, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
