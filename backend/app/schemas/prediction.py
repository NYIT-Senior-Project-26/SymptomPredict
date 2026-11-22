from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from shared import ConditionScore


class SymptomInput(BaseModel):
    # In plain words, e.g. the app's symptom chips. The backend matches them to the
    # ML model's symptoms (app/prediction/symptom_map.py); the rest go to Claude as unmatched.
    symptoms: list[str] = Field(min_length=1, max_length=50, examples=[["Headache", "Fever"]])
    # Follow-up question id → selected options, e.g. {"fever": ["Yes"]}
    follow_up_answers: dict[str, list[str]] = Field(
        default_factory=dict, max_length=100, examples=[{"fever": ["Yes"]}]
    )
    age: int | None = Field(default=None, ge=0, le=120)
    sex: Literal["male", "female", "other"] | None = None
    duration_days: int | None = Field(default=None, ge=0)
    notes: str | None = None


# Claude's structured output requires "additionalProperties": false on every object,
# which extra="forbid" adds to the JSON schema.
class Condition(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    likelihood: Literal["low", "medium", "high"]
    # One plain sentence on what the condition is (the card's description in Figma 3.1)
    description: str
    # Reported symptoms that fit this condition, as short labels ("Fever", "No cough")
    matching_symptoms: list[str]
    # Why it fits this person's answers ("Why this match" in Figma 3.1)
    rationale: str


class PredictionResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    conditions: list[Condition]
    urgency: Literal["self_care", "see_doctor", "urgent_care", "emergency"]
    # Short headline for "What to do next", e.g. "See a doctor within 24–48 hours"
    next_step: str
    recommended_specialty: str
    advice: str
    # Self-care only: when to see a doctor instead ("See a doctor if you notice"); else empty
    warning_signs: list[str]
    disclaimer: str = (
        "This is not a medical diagnosis. Consult a licensed clinician. "
        "If you think you have an emergency, call 911."
    )


class PredictionResponse(PredictionResult):
    """What /predict returns: Claude's result plus the ML ranking it was given.

    Kept separate from PredictionResult, which is the schema Claude fills in.
    """

    model_candidates: list[ConditionScore] = Field(default_factory=list)
    # Dataset symptoms the ranking is based on
    model_symptoms: list[str] = Field(default_factory=list)
    # Reported symptoms the model never saw (Claude assessed them on its own)
    unmatched_symptoms: list[str] = Field(default_factory=list)
