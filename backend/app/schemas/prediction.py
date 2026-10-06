from typing import Literal

from pydantic import BaseModel, Field


class SymptomInput(BaseModel):
    symptoms: list[str] = Field(min_length=1, examples=[["headache", "fever"]])
    age: int | None = Field(default=None, ge=0, le=120)
    sex: Literal["male", "female", "other"] | None = None
    duration_days: int | None = Field(default=None, ge=0)
    notes: str | None = None


class Condition(BaseModel):
    name: str
    likelihood: Literal["low", "medium", "high"]
    rationale: str


class PredictionResult(BaseModel):
    conditions: list[Condition]
    urgency: Literal["self_care", "see_doctor", "urgent_care", "emergency"]
    recommended_specialty: str
    advice: str
    disclaimer: str = (
        "This is not a medical diagnosis. Consult a licensed clinician. "
        "If you think you have an emergency, call 911."
    )
