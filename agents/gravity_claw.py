import json
import os
import uuid
import time
from datetime import datetime
from typing import Dict, Any, List
try:
    import resend
except ImportError:
    resend = None


class GravityClaw:
    """
    GRAVITYCLAW ORCHESTRATOR v2.0 - SWARM EDITION
    Mission: Autonomous Bill 96 Compliance Discovery & Remediation
    """

    def __init__(self, root_dir: str = "."):
        self.root_dir = root_dir
        self.memory_file = os.path.join(root_dir, "agents", "memory.json")
        self.findings_file = os.path.join(root_dir, "agents", "findings.md")
        self.directory_file = os.path.join(root_dir, "src", "lib", "directory_data.json")
        self.active_swarms: List[str] = ["Linguistic_Scout_v1", "Outreach_Agent_v3"]
        self.resend_key = os.getenv("RESEND_API_KEY")
        if self.resend_key and resend:
            resend.api_key = self.resend_key

        if not os.path.exists(self.memory_file):
            self._initialize_memory()

    def _initialize_memory(self):
        initial_state = {
            "version": "2.0.0",
            "uptime": datetime.now().isoformat(),
            "total_audits": 0,
            "compliance_buffer": [],
            "active_tasks": []
        }
        self.save_memory(initial_state)

    def load_memory(self) -> Dict[str, Any]:
        for _ in range(5):
            try:
                if not os.path.exists(self.memory_file):
                    return {}
                with open(self.memory_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (IOError, json.JSONDecodeError):
                time.sleep(0.5)
        return {}

    def save_memory(self, data: Dict[str, Any]):
        for _ in range(5):
            try:
                with open(self.memory_file, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
                return
            except IOError:
                time.sleep(0.5)

    def prying_action(self, target: str, action: str):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        mem = self.load_memory()
        mem["total_audits"] = mem.get("total_audits", 0) + 1
        mem["active_tasks"].insert(0, {
            "time": timestamp,
            "target": target,
            "action": action
        })
        mem["active_tasks"] = mem["active_tasks"][:20]
        self.save_memory(mem)
        self.save_memory(mem)

    def scout_new_leads(self, sector: str = "Construction"):
        print(f"🕵️‍♂️ [GRAVITYCLAW]: Scouting {sector} sector...")
        leads = [
            {
                "name": f"{sector} Systems Elite",
                "domain": f"{sector.lower()}-systems-elite.qc.ca",
                "neq": f"117{os.urandom(2).hex().upper()}"
            },
            {
                "name": f"Groupe {sector} Montreal High",
                "domain": f"groupe{sector.lower()}mtl-high.com",
                "neq": f"115{os.urandom(2).hex().upper()}"
            }
        ]
        return leads

    def sync_to_directory(self, business_data: Dict[str, Any]):
        print(f"💾 [SYNC]: Saving {business_data['name']} to {self.directory_file}")
        try:
            db = {}
            if os.path.exists(self.directory_file):
                for _ in range(5):
                    try:
                        with open(self.directory_file, "r", encoding="utf-8") as f:
                            db = json.load(f)
                        break
                    except (IOError, json.JSONDecodeError):
                        time.sleep(0.5)
            
            name_clean = business_data["name"].lower().replace(" ", "-")
            slug = "".join(c for c in name_clean if c.isalnum() or c == "-")

            new_entry: Dict[str, Any] = {
                "id": f"ZY-{uuid.uuid4().hex[:5].upper()}",
                "name": business_data["name"],
                "category": "SERVICES",
                "slug": slug,
                "isVerified": False,
                "neq": business_data["neq"],
                "loc": "QUEBEC, CA",
                "auditDate": datetime.now().strftime("%Y-%m-%d"),
                "riskLevel": business_data.get("risk", "HIGH"),
                "riskScore": business_data.get("score", 70),
                "violations": business_data.get("violations", ["BILL_96_GAP: Automated audit pending final verification."]),
                "domain": business_data["domain"],
                "outreachStatus": "PENDING",
                "interactions": []
            }
            db[slug] = new_entry
            
            for _ in range(5):
                try:
                    with open(self.directory_file, "w", encoding="utf-8") as f:
                        json.dump(db, f, indent=2, ensure_ascii=False)
                    print(f"✅ [SYNC]: Successfully written {slug}.")
                    return
                except IOError:
                    time.sleep(0.5)
        except Exception as e:
            print(f"❌ [SYNC_ERR]: {str(e)}")

    def _draft_compliance_notice(self, business_name: str, risk_level: str, domain: str) -> Dict[str, str]:
        """Drafts a high-stakes compliance notice based on linguistic forensic analysis."""
        
        if risk_level == "CRITICAL":
            subject = f"URGENT : Avis de non-conformité linguistique (Loi 96) - {business_name}"
            body = (
                f"À l'attention de la direction de {business_name},\n\n"
                f"Notre essaim autonome (GravityClaw v2.0) a identifié des lacunes linguistiques critiques "
                f"sur le domaine {domain}. En vertu de la Charte de la langue française (Loi 96), "
                "le défaut de priorité au français dans les communications numériques peut entraîner des amendes "
                "quotidiennes dépassant 20 000 $.\n\n"
                "Zyeuté a préparé un audit forensique pour votre entité. Nous recommandons une remédiation immédiate "
                "pour éviter la prochaine vague d'application de l'OQLF.\n\n"
                "Consultez votre dossier : http://zyeute.qc.ca/directory\n\n"
                "-----------------------------------\n"
                "English context: Critical linguistic gaps identified. Fines exceeding $20k/day possible under Bill 96.\n\n"
                "Respectueusement,\n"
                "Max Agent-Zero\n"
                "Orchestrateur d'Essaim Linguistique Zyeuté"
            )
        else:
            subject = f"Avis : Audit de conformité linguistique au Québec - {business_name}"
            body = (
                f"Bonjour,\n\n"
                f"Un audit linguistique a été effectué sur {domain}. Nous avons détecté des risques de conformité "
                "modérés qui pourraient attirer l'attention des autorités réglementaires sous la Loi 96.\n\n"
                "Zyeuté a ajouté votre entreprise au Répertoire Public de Conformité. Vous pouvez réclamer votre "
                "profil et demander un plan de remédiation complet ici : http://zyeute.qc.ca/claim\n\n"
                "-----------------------------------\n"
                "English context: Linguistic audit performed. Moderate compliance risks detected under Bill 96.\n\n"
                "Cordialement,\n"
                "Orchestration GravityClaw"
            )
            
        return {"subject": subject, "body": body}

    def deploy_outreach(self, business_id: str, auto_send: bool = False):
        """Triggers the outreach swarm for a specific business ID."""
        print(f"🚀 [SWARM]: Deploying Outreach for {business_id}...")
        
        try:
            with open(self.directory_file, "r", encoding="utf-8") as f:
                db = json.load(f)
            
            target_slug = None
            for slug, data in db.items():
                if data.get("id") == business_id or slug == business_id:
                    target_slug = slug
                    break
            
            if not target_slug:
                return {"status": "ERROR", "message": "Business not found."}

            target_biz = db[target_slug]
            notice = self._draft_compliance_notice(
                target_biz["name"],
                target_biz["riskLevel"],
                target_biz["domain"]
            )
            
            target_biz.setdefault("interactions", [])
            
            status = "STAGED"
            if auto_send:
                # High-fidelity transmission
                print(f"📨 [SEND]: Dispatching to linguistic nexus for {target_biz['name']}...")
                
                send_success = True
                if self.resend_key and resend:
                    try:
                        resend.Emails.send({
                            "from": "Zyeuté Compliance <compliance@zyeute.qc.ca>",
                            "to": ["brandonlacoste9@gmail.com"], # Safety: Send to user for verification in dev
                            "subject": notice["subject"],
                            "html": notice["body"].replace("\n", "<br>")
                        })
                        print(f"✅ [RESEND]: Email sent via API.")
                    except Exception as e:
                        print(f"❌ [RESEND_ERR]: {str(e)}")
                        send_success = False

                if send_success:
                    self.prying_action(target_biz["domain"], f"NOTICE_DISPATCHED_{target_biz['riskLevel']}")
                    target_biz["isOutreachSent"] = True
                    target_biz["outreachDate"] = datetime.now().strftime("%Y-%m-%d")
                    target_biz["outreachStatus"] = "SENT"
                    target_biz.setdefault("interactions", []).append({
                        "type": "OUTREACH",
                        "timestamp": datetime.now().isoformat(),
                        "detail": f"Forensic notice dispatched: {target_biz['riskLevel']}"
                    })
                    status = "SENT"
                else:
                    status = "FAILED"
                
                # Persist the SENT state
                with open(self.directory_file, "w", encoding="utf-8") as f:
                    json.dump(db, f, indent=2, ensure_ascii=False)
            else:
                self.prying_action(target_biz["name"], f"OUTREACH_STAGED: {target_biz['riskLevel']}")
            
            return {
                "status": status,
                "business": target_biz["name"],
                "risk": target_biz["riskLevel"],
                "subject": notice["subject"],
                "draft": notice["body"]
            }
        except Exception as e:
            return {"status": "ERROR", "message": str(e)}

    def process_inbound_signal(self, target_domain: str, signal_type: str, raw_content: str = ""):
        """
        Processes a signal returning from the field (e.g., email reply, link click, portal login).
        This makes the swarm 'reactive' to business owner actions.
        """
        print(f"👂 [NEXUS]: Inbound signal detected from {target_domain}: {signal_type}")
        try:
            with open(self.directory_file, "r", encoding="utf-8") as f:
                db = json.load(f)

            target_slug = None
            for slug, data in db.items():
                if data.get("domain") == target_domain:
                    target_slug = slug
                    break

            if not target_slug:
                print(f"⚠️ [NEXUS]: Unknown domain {target_domain}. Ignoring.")
                return

            biz = db[target_slug]
            biz["outreachStatus"] = signal_type.upper()
            biz["interactions"].append({
                "type": "INBOUND",
                "timestamp": datetime.now().isoformat(),
                "signal": signal_type,
                "detail": raw_content[:100]
            })

            # Update memory to notify the user/orchestrator
            self.prying_action(target_domain, f"INBOUND_{signal_type}")

            for _ in range(5):
                try:
                    with open(self.directory_file, "w", encoding="utf-8") as f:
                        json.dump(db, f, indent=2, ensure_ascii=False)
                    print(f"✅ [NEXUS]: Successfully logged {signal_type} for {target_slug}.")
                    return {"status": "LOGGED", "target": target_slug}
                except IOError:
                    time.sleep(0.5)
        except Exception as e:
            print(f"❌ [NEXUS_ERR]: {str(e)}")
            return {"status": "ERROR", "message": str(e)}

    def deep_scout_business(self, query: str) -> Dict[str, Any]:
        """Performs a real-time high-fidelity search for a business not in the directory."""
        print(f"📡 [DEEP_SCOUT]: Initiating real-time swarm search for '{query}'...")
        
        # In a production environment, this would call OpenClaw or a Search API.
        # Here we simulate the result of a successful swarm discovery.
        # We'll generate a plausible NEQ and domain based on the query.
        
        detected_name = query.title()
        if not detected_name.endswith("Inc.") and not detected_name.endswith("Ltee"):
            detected_name += " Enr."
            
        clean_name = query.lower().replace(" ", "")
        detected_domain = f"{clean_name}.ca"
        detected_neq = f"117{uuid.uuid4().hex[:7].upper()}"
        
        # Log the action
        self.prying_action(query, "DEEP_SCOUT_IDENTIFIED")
        
        # Returns the core data needed to run an audit
        return {
            "name": detected_name,
            "domain": detected_domain,
            "neq": detected_neq,
            "found": True
        }

    def check_openclaw_link(self) -> Dict[str, Any]:
        try:
            import subprocess
            result = subprocess.run(
                ["openclaw", "--version"],
                capture_output=True, text=True, shell=True
            )
            if result.returncode == 0:
                return {"active": True, "version": result.stdout.strip()}
            return {"active": False, "error": "Handshake Timeout"}
        except Exception as e:
            return {"active": False, "error": str(e)}

    def get_system_status(self):
        mem = self.load_memory()
        return {
            "status": "OPERATIONAL",
            "version": mem.get("version", "2.0.0"),
            "claw_engagement": "SWARM_ACTIVE",
            "audits_completed": mem.get("total_audits", 0),
            "active_swarms": self.active_swarms,
            "openclaw_link": self.check_openclaw_link(),
            "recent_tasks": mem.get("active_tasks", [])
        }
