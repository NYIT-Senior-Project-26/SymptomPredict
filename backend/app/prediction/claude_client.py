import json

import anthropic

from app.core.config import get_settings
from app.schemas.prediction import PredictionResult, SymptomInput

SYSTEM_PROMPT = """You are a medical triage assistant inside a symptom-checker app.
Given a patient's reported symptoms (and optionally a ranked list of candidate
conditions from a statistical model), return the most plausible conditions,
an urgency level, the medical specialty they should see, and short practical advice.
You do not diagnose. Escalate urgency whenever red-flag symptoms are present
(e.g. chest pain, difficulty breathing, stroke signs, severe bleeding)."""

_settings = get_settings()
_client = anthropic.AsyncAnthropic(api_key=_settings.anthropic_api_key or None)


async def analyze_symptoms(
    data: SymptomInput, ml_candidates: list[tuple[str, float]]
) -> PredictionResult:
    user_content = {
        "symptoms": data.symptoms,
        "age": data.age,
        "sex": data.sex,
        "duration_days": data.duration_days,
        "notes": data.notes,
        "ml_candidates": [{"condition": c, "probability": round(p, 3)} for c, p in ml_candidates],
    }

    response = await _client.beta.messages.create(
        model=_settings.claude_model,
        max_tokens=16000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": json.dumps(user_content)}],
        output_config={
            "effort": "medium",
            "format": {"type": "json_schema", "schema": PredictionResult.model_json_schema()},
        },
        # Re-run on a fallback model if a safety classifier declines the request
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
    )

    if response.stop_reason == "refusal":
        raise RuntimeError("Claude declined to analyze these symptoms")

    text = next(b.text for b in response.content if b.type == "text")
    return PredictionResult.model_validate_json(text)
