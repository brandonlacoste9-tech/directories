import os
import json
import time
from datetime import datetime
from gravity_claw import Sentinelle-96

# REGISTRE_LOI96 RESPONSE DIPLOMAT
# Mission: Handle inbound communications and manage remediation conversion.

class ResponseDiplomat:
    def __init__(self, root_dir: str):
        self.root_dir = root_dir
        self.claw = Sentinelle-96(root_dir=root_dir)
        self.is_running = True

    def generate_reply(self, signal_type: str, company_name: str):
        """
        Generates a high-fidelity French compliance response based on intent.
        Following @bill-96-forensic-diplomat skill guidelines.
        """
        replies = {
            "REPLIED": (
                f"Bonjour {company_name},\n\n"
                "Merci de votre intérêt pour la conformité linguistique. Nous préparons actuellement votre dossier "
                "de remédiation Loi 96 complet. Ce document détaille les étapes pour aligner votre présence numérique "
                "avec les exigences de l'OQLF.\n\n"
                "Un agent de notre équipe d'accompagnement vous contactera sous peu pour finaliser l'implémentation.\n\n"
                "Cordialement,\nL'Équipe de Diplomatie Le Registre Loi 96"
            ),
            "CLICKED": (
                f"Bonjour {company_name},\n\n"
                "Nous avons remarqué votre intérêt pour le rapport de conformité de votre entreprise. "
                "C'est un premier pas crucial pour sécuriser vos opérations au Québec.\n\n"
                "Souhaitez-vous une consultation gratuite pour interpréter les résultats de votre audit ?\n\n"
                "Cordialement,\nL'Équipe de Diplomatie Le Registre Loi 96"
            ),
            "CONVERTED": (
                f"Félicitations {company_name}!\n\n"
                "Votre bouclier de conformité Le Registre Loi 96 est maintenant actif. Votre entreprise est désormais protégée par "
                "notre système de surveillance continue des normes de la Loi 96.\n\n"
                "Bienvenue dans l'écosystème de pérennité linguistique Le Registre Loi 96."
            ),
            "DISPUTED": (
                f"Bonjour {company_name},\n\n"
                "Nous avons pris note de votre contestation. Nos experts en audit forensic révisent actuellement les "
                "preuves de non-conformité relevées sur vos actifs numériques.\n\n"
                "Nous vous reviendrons avec un rapport détaillé liant chaque manquement aux articles spécifiques "
                "de la Charte de la langue française.\n\n"
                "Cordialement,\nService de Vérification Le Registre Loi 96"
            )
        }
        return replies.get(signal_type, "Action enregistrée dans le registre Le Registre Loi 96. En attente de traitement diplomatique.")

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
                        if action.get("type") == "INBOUND" and "reply_sent" not in action:
                            signal = action.get("signal", "INQUIRY")
                            company = biz.get("name")
                            
                            print(f"📧 [DIPLOMACY]: Handling {signal} from {company}...")
                            
                            # Generate the AI Reply
                            reply_text = self.generate_reply(signal, company)
                            
                            # Log the Outbound Reply back to the business
                            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                            action["reply_sent"] = {
                                "time": timestamp,
                                "content": reply_text,
                                "agent": "REGISTRE_LOI96_DIPLOMAT_01"
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
