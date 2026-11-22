from app.prediction import ml_model
from app.prediction.claude_client import analyze_symptoms
from app.schemas.prediction import PredictionResponse, SymptomInput


async def predict(data: SymptomInput) -> PredictionResponse:
    """ML model ranks what it recognizes; Claude weighs that ranking against
    everything else the user reported and makes the final call."""
    ranking = ml_model.rank(data.symptoms, data.follow_up_answers)
    result = await analyze_symptoms(data, ranking)
    return PredictionResponse(
        **result.model_dump(),
        model_candidates=ranking.candidates,
        model_symptoms=ranking.used,
        unmatched_symptoms=ranking.unmatched,
    )
