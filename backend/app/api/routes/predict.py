from fastapi import APIRouter, HTTPException

from app.prediction import engine
from app.schemas.prediction import PredictionResponse, SymptomInput

router = APIRouter(prefix="/predict", tags=["prediction"])


@router.post("", response_model=PredictionResponse)
async def predict(data: SymptomInput) -> PredictionResponse:
    try:
        return await engine.predict(data)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
