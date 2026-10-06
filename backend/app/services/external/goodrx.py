"""GoodRx price comparison.

GoodRx API access is partner-only: apply at https://www.goodrx.com/developer.
Once approved, implement request signing per their docs using GOODRX_API_KEY/SECRET.
"""

from app.core.config import get_settings


async def get_prices(drug_name: str, zip_code: str | None = None) -> dict:
    if not get_settings().goodrx_api_key:
        raise NotImplementedError("GoodRx API key not configured")
    raise NotImplementedError("TODO: implement once GoodRx partner access is granted")
