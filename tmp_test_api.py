import requests
import json

DATA_QUEBEC_URL = "https://www.donneesquebec.ca/recherche/api/3/action/datastore_search"
RESOURCE_ID = "220c8f63-b145-4200-8c05-25af7b69c856"

def test_api():
    params = {
        'resource_id': RESOURCE_ID,
        'limit': 1
    }
    try:
        response = requests.get(DATA_QUEBEC_URL, params=params, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
