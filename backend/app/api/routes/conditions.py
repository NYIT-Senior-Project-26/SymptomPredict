import httpx
from fastapi import APIRouter, HTTPException

from app.prediction.condition_detail import condition_detail
from app.schemas.condition import ConditionDetailRequest, ConditionDetailResponse

router = APIRouter(prefix="/conditions", tags=["conditions"])


@router.post("/detail", response_model=ConditionDetailResponse)
async def detail(req: ConditionDetailRequest) -> ConditionDetailResponse:
    """Condition details and treatment options (Figma 3.6), sourced from MedlinePlus."""
    try:
        result = await condition_detail(req)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail="MedlinePlus is unavailable") from e
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    if result is None:
        raise HTTPException(status_code=404, detail="No MedlinePlus information for this condition")
    return result
