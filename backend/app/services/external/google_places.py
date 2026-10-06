import httpx

from app.core.config import get_settings

URL = "https://places.googleapis.com/v1/places:searchText"


async def search_providers(query: str, lat: float, lng: float, radius_m: int = 10000) -> list[dict]:
    """Find nearby clinics/doctors, e.g. query='dermatologist'."""
    headers = {
        "X-Goog-Api-Key": get_settings().google_places_api_key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,"
        "places.location,places.rating,places.nationalPhoneNumber",
    }
    body = {
        "textQuery": query,
        "locationBias": {"circle": {"center": {"latitude": lat, "longitude": lng}, "radius": radius_m}},
    }
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(URL, json=body, headers=headers)
        r.raise_for_status()
        return r.json().get("places", [])
