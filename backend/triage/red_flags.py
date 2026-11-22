from pydantic import BaseModel, ConfigDict, Field, model_validator
from shared import Symptom, normalize_symptom_name

class RedFlagRule(BaseModel):
    # frozen: rules are constants; nothing should modify one at runtime
    model_config = ConfigDict(frozen=True, extra="forbid")

    id: str # stable key for logs/tests, e.g. "stroke"
    name: str # human-readable, e.g. "Possible stroke"
    all_of: frozenset[str] = frozenset() # every one of these must be present
    any_of: frozenset[str] = frozenset() # at least one of these must be present

    # User-facing copy for the emergency screen's "What to do next" card.
    explanation: str = Field(max_length=300)

    @model_validator(mode="after")
    def needs_at_least_one_condition(self) -> "RedFlagRule":
        # A rule with both sets empty would fire for EVERY input
        if not self.all_of and not self.any_of:
            raise ValueError(f"rule {self.id!r} has no symptoms")
        return self

    def matches(self, reported: set[str]) -> set[str]:
        # Set operations do the work: `<=` is "is a subset of", `&` is intersection
        if not self.all_of <= reported:
            return set()
        hits = reported & self.any_of
        if self.any_of and not hits:
            return set()
        return set(self.all_of) | hits


class RedFlagMatch(BaseModel):
    rule_id: str
    name: str
    matched_symptoms: list[str] # sorted, so output is stable for tests and logs
    explanation: str


# Shown on every emergency screen
EMERGENCY_HEADLINE = "Call 911 or go to the nearest ER now"

RED_FLAG_RULES: list[RedFlagRule] = [
    RedFlagRule(
        id="heart_attack",
        name="Possible heart attack",
        all_of=frozenset({"chest_pain"}),
        any_of=frozenset({"breathlessness", "sweating", "fast_heart_rate", "palpitations"}),
        explanation=(
            "Chest pain with these symptoms can be a sign of a heart or lung emergency. "
            "Don't drive yourself and don't wait to see if it passes."
        )
    ),
    RedFlagRule(
        id="stroke",
        name="Possible stroke",
        any_of=frozenset({"weakness_of_one_body_side", "slurred_speech"}),
        explanation=(
            "Sudden weakness on one side of the body or slurred speech can be signs of a stroke. "
            "Every minute matters. Note the time symptoms started."
        )
    ),
    RedFlagRule(
        id="reduced_consciousness",
        name="Reduced consciousness",
        any_of=frozenset({"coma", "altered_sensorium"}),
        explanation=(
            "Confusion, unusual drowsiness or being hard to wake needs emergency care right away."
        )
    ),
    RedFlagRule(
        id="serious_bleeding",
        name="Serious bleeding",
        any_of=frozenset({"stomach_bleeding", "blood_in_sputum"}),
        explanation=(
            "Bleeding from the stomach or coughing up blood can be serious and needs "
            "emergency care."
        ),
    ),
    RedFlagRule(
        id="possible_meningitis",
        name="Possible meningitis",
        all_of=frozenset({"high_fever", "stiff_neck"}),
        explanation=(
            "A high fever with a stiff neck can be a sign of meningitis, which needs "
            "emergency treatment."
        ),
    ),
]


def evaluate_red_flags(symptoms: list[Symptom] | list[str]) -> list[RedFlagMatch]:
    reported = {
        s.name if isinstance(s, Symptom) else normalize_symptom_name(s)
        for s in symptoms
    }

    matches = []
    for rule in RED_FLAG_RULES:
        hit = rule.matches(reported)
        if hit:
            matches.append(
                RedFlagMatch(
                    rule_id=rule.id,
                    name=rule.name,
                    matched_symptoms=sorted(hit),
                    explanation=rule.explanation,
                )
            )
    return matches
