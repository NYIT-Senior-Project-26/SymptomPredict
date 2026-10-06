import httpx

from app.core.config import get_settings

BASE = "https://api.fda.gov"


async def drug_label(generic_name: str) -> dict | None:
    """Fetch FDA label info (warnings, indications, adverse reactions)."""
    params = {"search": f'openfda.generic_name:"{generic_name}"', "limit": 1}
    if key := get_settings().openfda_api_key:
        params["api_key"] = key
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{BASE}/drug/label.json", params=params)
        if r.status_code == 404:
            return None
        r.raise_for_status()
        results = r.json().get("results", [])
        return results[0] if results else None
