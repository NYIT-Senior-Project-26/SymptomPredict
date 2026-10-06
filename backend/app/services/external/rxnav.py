import httpx

BASE = "https://rxnav.nlm.nih.gov/REST"


async def find_drugs(name: str) -> list[dict]:
    """Look up drug concepts (RxCUI, name) by name. No API key required."""
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{BASE}/drugs.json", params={"name": name})
        r.raise_for_status()
        groups = r.json().get("drugGroup", {}).get("conceptGroup", []) or []
        return [p for g in groups for p in g.get("conceptProperties", [])]
