"""Zocdoc appointment booking.

Zocdoc's API is partner-only: apply through Zocdoc's partner program.
Once approved, implement OAuth client-credentials with ZOCDOC_CLIENT_ID/SECRET.
"""

from app.core.config import get_settings


async def find_availability(specialty: str, zip_code: str) -> list[dict]:
    if not get_settings().zocdoc_client_id:
        raise NotImplementedError("Zocdoc credentials not configured")
    raise NotImplementedError("TODO: implement once Zocdoc partner access is granted")
