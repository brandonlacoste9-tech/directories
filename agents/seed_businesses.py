import requests
import json
import uuid
import sys

# API for Registraire des entreprises (Quebec Business Registry)
DATA_QUEBEC_URL = "https://www.donneesquebec.ca/recherche/api/3/action/datastore_search"
# Use a valid resource ID - this one is for the REQ open dataset
RESOURCE_ID = "220c8f63-b145-4200-8c05-25af7b69c856" 

def fetch_quebec_businesses(offset=0, limit=100):
    """
    Fetches business data from the official Données Québec API.
    """
    params = {
        'resource_id': RESOURCE_ID,
        'limit': limit,
        'offset': offset
    }
    try:
        response = requests.get(DATA_QUEBEC_URL, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        return data.get('result', {}).get('records', [])
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

def transform_to_supabase(record):
    """
    Map the raw REQ record to our local business schema.
    """
    # Sample fields from REQ: 'nom_entreprise', 'numero_entreprise_du_quebec', etc.
    return {
        "id": str(uuid.uuid4()),
        "name_fr": record.get('nom_entreprise', 'Entreprise Inconnue'),
        "neq": record.get('numero_entreprise_du_quebec', 'N/A'),
        "category": record.get('secteur_activite', 'Autres Services'),
        "is_bill96_verified": False,
        "is_premium": False,
        "location": record.get('adresse_ville', 'Montréal'),
        "description": f"Enregistrement REQ pour {record.get('nom_entreprise')}.",
    }

def main():
    print("Initializing Quebec Business Seed Process...")
    print(f"Targeting: {DATA_QUEBEC_URL}")
    
    # 1. Fetch data
    records = fetch_quebec_businesses(limit=10)
    
    if not records:
        print("No records found. Check Resource ID or API status.")
        sys.exit(1)
        
    print(f"Processing {len(records)} records...")
    
    # 2. Transform
    business_batch = [transform_to_supabase(r) for r in records]
    
    # 3. Output as JSON for manual import or direct Supabase call
    # In production, we'd use the Supabase Python client here.
    output_file = "seed_data_batch.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(business_batch, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated {output_file}.")
    print("To sync with Supabase, run: node scripts/sync_to_db.js seed_data_batch.json")

if __name__ == "__main__":
    main()
