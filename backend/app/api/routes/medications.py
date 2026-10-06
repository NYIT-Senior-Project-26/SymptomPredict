from fastapi import APIRouter, HTTPException

from app.services.external import goodrx, openfda, rxnav

router = APIRouter(prefix="/medications", tags=["medications"])


@router.get("/search")
async def search(name: str):
    return await rxnav.find_drugs(name)


@router.get("/label")
async def label(generic_name: str):
    result = await openfda.drug_label(generic_name)
    if result is None:
        raise HTTPException(status_code=404, detail="No FDA label found")
    return result


@router.get("/prices")
async def prices(name: str, zip_code: str | None = None):
    try:
        return await goodrx.get_prices(name, zip_code)
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e)) from e
