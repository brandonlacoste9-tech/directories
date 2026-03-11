
import os
import re

def sanitize_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(('.py', '.md', '.json', '.tsx', '.ts')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Replace Zyeuté (case insensitive variations)
                    new_content = re.sub(r'Zyeuté', 'Le Registre Loi 96', content)
                    new_content = re.sub(r'ZYEUTÉ', 'REGISTRE_LOI96', new_content)
                    new_content = re.sub(r'zyeute', 'loi96repertoire', new_content)
                    
                    # Replace GravityClaw with more official Sentinel-96
                    new_content = re.sub(r'GravityClaw', 'Sentinelle-96', new_content)
                    new_content = re.sub(r'GRAVITYCLAW', 'SENTINELLE-96', new_content)
                    new_content = re.sub(r'GRAVITY_CLAW', 'SENTINELLE_96', new_content)
                    
                    # Replace legacy ID prefixes
                    new_content = re.sub(r'ZY-', 'LOI96-', new_content)
                    
                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Sanitized: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

# Sanitize all relevant folders
folders = [
    'c:/Users/booboo/directorie/directories/agents',
    'c:/Users/booboo/directorie/directories/skills',
    'c:/Users/booboo/directorie/directories/src/lib',
    'c:/Users/booboo/directorie/directories/src/app',
    'c:/Users/booboo/directorie/directories/src/components'
]

for folder in folders:
    if os.path.exists(folder):
        sanitize_folder(folder)
