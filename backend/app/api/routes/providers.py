from fastapi import APIRouter, HTTPException

from app.services.external import google_places, zocdoc

router = APIRouter(prefix="/providers", tags=["providers"])


@router.get("/nearby")
async def nearby(specialty: str, lat: float, lng: float):
    return await google_places.search_providers(specialty, lat, lng)


@router.get("/availability")
async def availability(specialty: str, zip_code: str):
    try:
        return await zocdoc.find_availability(specialty, zip_code)
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e)) from e
