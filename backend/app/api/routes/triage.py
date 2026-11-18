import logging
from fastapi import APIRouter, HTTPException
from app.schemas.triage import TriageRequest, TriageResult
from ml_layer.data import disease_profiles
from ml_layer.model import top_k_predictions
from shared import ConditionScore, Symptom
from triage.build import build_emergency_result
from triage.red_flags import evaluate_red_flags

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/triage", tags=["triage"])
top_k = 5

def _safe_predictions(symptoms: list[Symptom]) -> list[ConditionScore]:
    known = set().union(*disease_profiles().values())
    usable = [s for s in symptoms if s.name in known]
    skipped = [s.name for s in symptoms if s.name not in known]
    if skipped:
        logger.info("triage: ignoring symptoms not in the dataset: %s", skipped)
    if not usable:
        return []

    try:
        return top_k_predictions(usable, top_k)
    except Exception:
        logger.exception("triage: model prediction failed; emergency screen shown without conditions")
        return []

@router.post("", response_model=TriageResult)
def triage(request: TriageRequest) -> TriageResult:
    red_flags = evaluate_red_flags(request.symptoms)

    if red_flags:
        predictions = _safe_predictions(request.symptoms)
        return build_emergency_result(red_flags, predictions, request.symptoms)

    raise HTTPException(
        status_code=501,
        detail="Non-emergency triage (appointment / self-care) is not implemented yet",
    )
