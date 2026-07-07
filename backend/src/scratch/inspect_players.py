import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

import json

from core.http_client import HttpClient

BASE_URL = "https://cxm-api.fifa.com/fifaplusweb/api"

PAGE_URL = (
    BASE_URL
    + "/pages/en/tournaments/mens/worldcup/canadamexicousa2026/teams/argentina/squad"
)

http = HttpClient()

# Step 1: Get the page
response = http.get(PAGE_URL)
data = response.json()

# Step 2: Find the EntireSquad endpoint
endpoint = None

for section in data["sections"]:
    if section["entryType"] == "EntireSquad":
        endpoint = section["entryEndpoint"]
        break

if endpoint is None:
    raise ValueError("EntireSquad endpoint not found.")

# Step 3: Fetch the squad data
url = f"{BASE_URL}/{endpoint}"

response = http.get(url)
data = response.json()

# Step 4: Print nicely
for key in data:
    print(key)