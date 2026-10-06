from app.prediction.claude_client import analyze_symptoms
from app.prediction.ml_model import symptom_model
from app.schemas.prediction import PredictionResult, SymptomInput


async def predict(data: SymptomInput) -> PredictionResult:
    """ML model narrows candidates, Claude reasons over them and triages."""
    candidates = symptom_model.predict(data.symptoms)
    return await analyze_symptoms(data, candidates)
