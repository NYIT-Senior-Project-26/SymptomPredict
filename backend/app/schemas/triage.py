from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, computed_field, model_validator

# These map 1:1 to the three Figma banners.
TriageLevel = Literal["emergency", "appointment", "self_care"]
PrimaryAction = Literal["call_911", "find_care", "find_pharmacy"]
SecondaryAction = Literal["show_nearest_er"]

class NextSteps(BaseModel):
    headline: str = Field(max_length=80)
    explanation: str = Field(max_length=300)
    primary_action: PrimaryAction
    secondary_action: SecondaryAction | None = None

class SymptomEvidence(BaseModel):
    label: str
    present: bool = True

class ConditionMatch(BaseModel):
    # One card in Possible Conditions

    rank: int = Field(ge=1, le=5)
    name: str
    short_description: str = Field(max_length=200)

    # Match score, base it off probability score
    match_score: int = Field(ge=0, le=100)

    matching_symptoms: list[SymptomEvidence] = Field(default_factory=list)
    why_this_match: str = Field(max_length=300)

    # To trace back to output's source of truth
    source: Literal["model", "llm"] = "model"

    assistant_available: bool = True

    # Used to compute label for ranked cards based off match score
    @computed_field
    @property
    def match_label(self) -> Literal["Strong match", "Moderate match"] | None:
        if self.match_score >= 70:
            return "Strong match"
        if self.match_score >= 40:
            return "Moderate match"
        return None  # lower-ranked cards just show "Match"


class TriageResult(BaseModel):
    # Lets the assistant chat + PDF export endpoints refer back to this result later
    session_id: UUID = Field(default_factory=uuid4)

    triage_level: TriageLevel
    next_steps: NextSteps

    # Yellow "See a doctor if you notice" box — self-care only
    warning_signs: list[str] = Field(default_factory=list)

    conditions: list[ConditionMatch] = Field(min_length=1, max_length=5)

    # Emergency screen: "No medication suggestions for emergencies."
    medication_guidance_allowed: bool = True

    disclaimer: str = (
        "DiagnosisCloud provides information, not a medical diagnosis. "
        "If symptoms get worse, seek care right away."
    )

    @model_validator(mode="after")
    def check_rules_for_level(self) -> "TriageResult":
        # Ranks must be 1..n in order, so the app can render the list as-is
        if [c.rank for c in self.conditions] != list(range(1, len(self.conditions) + 1)):
            raise ValueError("conditions must be ranked 1..n in order")

        if self.triage_level == "emergency":
            # Hard safety rules
            if self.next_steps.primary_action != "call_911":
                raise ValueError("emergency results must use primary_action='call_911'")
            if self.medication_guidance_allowed:
                raise ValueError("emergency results must not allow medication guidance")
            if any(c.assistant_available for c in self.conditions):
                raise ValueError("assistant chat is disabled for emergency results")

        if self.triage_level != "self_care" and self.warning_signs:
            raise ValueError("warning_signs are only shown for self_care results")

        return self
