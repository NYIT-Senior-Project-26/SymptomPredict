from app.schemas.triage import ConditionMatch, NextSteps, SymptomEvidence, TriageResult
from ml_layer.data import disease_profiles
from shared import ConditionScore, Symptom
from triage.red_flags import EMERGENCY_HEADLINE, RedFlagMatch

def _label(symptom_name: str) -> str:
    return symptom_name.capitalize().replace('_', ' ')

def _condition_cards(predictions: list[ConditionScore], symptoms: list[Symptom]) -> list[ConditionMatch]:
    profiles = disease_profiles()
    reported = [s.name for s in symptoms]

    cards = []
    for rank, prediction in enumerate(predictions, start=1):
        profile = profiles.get(prediction.name, frozenset())
        matching = [name for name in reported if name in profile]

        if matching:
            why = "Matches your reported symptoms: " + ", ".join(_label(m).lower() for m in matching) + "."
        else:
            why = "None of your reported symptoms are typical of this condition."

        cards.append(
            ConditionMatch(
                rank=rank,
                name=prediction.name.capitalize(),
                short_description="",
                match_score=prediction.match_score,
                matching_symptoms=[SymptomEvidence(label=_label(m)) for m in matching],
                why_this_match=why[:300],
                source="model",
                assistant_available=False,
            )
        )
    return cards

def build_emergency_result(red_flags, predictions, symptoms) -> TriageResult:
    if not red_flags:
        # Never build an emergency screen without a reason to show the user
        raise ValueError("build_emergency_result needs at least one red-flag match")

    # Rules are in priority order, so the first match is the most time-critical.
    # Only its text is used: combining several could exceed the 300-char limit.
    first = red_flags[0]

    return TriageResult(
        triage_level="emergency",
        next_steps=NextSteps(
            headline=EMERGENCY_HEADLINE,
            explanation=first.explanation,
            primary_action="call_911",
            secondary_action="show_nearest_er",
        ),
        conditions=_condition_cards(predictions, symptoms),
        medication_guidance_allowed=False,
    )