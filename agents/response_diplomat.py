import os
import json
import time
from datetime import datetime
from gravity_claw import GravityClaw

# ZYEUTÉ RESPONSE DIPLOMAT
# Mission: Handle inbound communications and manage remediation conversion.

class ResponseDiplomat:
    def __init__(self, root_dir: str):
        self.root_dir = root_dir
        self.claw = GravityClaw(root_dir=root_dir)
        self.is_running = True

    def generate_reply(self, signal_type: str, company_name: str):
        """Generates a high-fidelity French compliance response based on intent."""
        replies = {
            "REPLIED": f"Bonjour {company_name}, merci de votre intérêt. Nous préparons votre dossier de remédiation Loi 96 complet. Un agent vous contactera pour finaliser l'implémentation.",
            "CLICKED": f"Nous avons détecté votre consultation du portail pour {company_name}. C'est un premier pas crucial vers la conformité.",
            "CONVERTED": f"Félicitations {company_name}! Votre bouclier de conformité est maintenant actif. Bienvenue dans l'écosystème Zyeuté.",
            "DISPUTED": f"Nous avons pris note de votre contestation pour {company_name}. Nos experts révisent actuellement les preuves de non-conformité relevées."
        }
        return replies.get(signal_type, "Action enregistrée dans le registre Zyeuté.")

    def run_diplomacy(self):
        print("🕊️ [RESPONSE_DIPLOMAT]: NEXUS DIPLOMACY ACTIVE.")
        print("---------------------------------------")
        
        while self.is_running:
            # Check for new signals in the directory
            directory_file = os.path.join(self.root_dir, "src", "lib", "directory_data.json")
            
            try:
                db = {}
                if os.path.exists(directory_file):
                    # Use a protected read loop
                    for _ in range(5):
                        try:
                            with open(directory_file, "r", encoding="utf-8") as f:
                                db = json.load(f)
                            break
                        except:
                            time.sleep(0.5)

                for slug, biz in db.items():
                    interactions = biz.get("interactions", [])
                    # Check for unhandled signals (actions without a RESPONSE)
                    for action in interactions:
                        if action.get("type").startswith("INBOUND") and "reply_sent" not in action:
                            signal = action.get("type").replace("INBOUND_", "")
                            company = biz.get("name")
                            
                            print(f"📧 [DIPLOMACY]: Handling {signal} from {company}...")
                            
                            # Generate the AI Reply
                            reply_text = self.generate_reply(signal, company)
                            
                            # Log the Outbound Reply back to the business
                            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                            action["reply_sent"] = {
                                "time": timestamp,
                                "content": reply_text,
                                "agent": "ZYEUTÉ_DIPLOMAT_01"
                            }
                            
                            self.claw.prying_action(biz.get("domain"), f"DIPLOMACY_REPLY_SENT_{signal}")
                            
                            # Save the updated directory
                            for _ in range(5):
                                try:
                                    with open(directory_file, "w", encoding="utf-8") as f:
                                        json.dump(db, f, indent=2, ensure_ascii=False)
                                    break
                                except:
                                    time.sleep(0.5)

            except Exception as e:
                print(f"❌ [DIPLOMACY_ERR]: {str(e)}")

            time.sleep(10) # Process every 10 seconds

if __name__ == "__main__":
    project_root = "c:\\Users\\booboo\\directorie\\directories"
    diplomat = ResponseDiplomat(root_dir=project_root)
    diplomat.run_diplomacy()
