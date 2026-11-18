"""Tests for triage/build.py and the TriageResult contract change.

Run from backend/:  pytest tests/test_build.py -v

Predictions are built by hand (ConditionScore objects), so these tests don't
need a trained model.
"""

import pytest
from pydantic import ValidationError

from app.schemas.triage import NextSteps, TriageResult
from ml_layer.data import disease_profiles
from shared import ConditionScore, Symptom
from triage.build import build_emergency_result
from triage.red_flags import EMERGENCY_HEADLINE, evaluate_red_flags


def symptoms_of(*names: str) -> list[Symptom]:
    return [Symptom(name=n, severity=5) for n in names]


# Figma "Seek emergency care", reduced to dataset columns, with scores like the mockup
FIGMA_SYMPTOMS = symptoms_of("chest_pain", "breathlessness", "sweating")
FIGMA_PREDICTIONS = [
    ConditionScore(name="heart attack", probability=0.54),
    ConditionScore(name="bronchial asthma", probability=0.20),
    ConditionScore(name="pneumonia", probability=0.18),
]


@pytest.fixture
def figma_result() -> TriageResult:
    return build_emergency_result(evaluate_red_flags(FIGMA_SYMPTOMS), FIGMA_PREDICTIONS, FIGMA_SYMPTOMS)


# ---------------------------------------------------------------------------
# The emergency screen
# ---------------------------------------------------------------------------

def test_figma_emergency_screen(figma_result):
    r = figma_result
    assert r.triage_level == "emergency"
    assert r.next_steps.headline == EMERGENCY_HEADLINE
    assert r.next_steps.primary_action == "call_911"
    assert r.next_steps.secondary_action == "show_nearest_er"
    assert r.medication_guidance_allowed is False
    assert r.warning_signs == []


def test_explanation_comes_from_the_red_flag_rule(figma_result):
    assert figma_result.next_steps.explanation.startswith("Chest pain with these symptoms")


def test_conditions_keep_model_order_and_scores(figma_result):
    cards = figma_result.conditions
    assert [c.rank for c in cards] == [1, 2, 3]
    assert [c.name for c in cards] == ["Heart attack", "Bronchial asthma", "Pneumonia"]
    assert [c.match_score for c in cards] == [54, 20, 18]
    assert all(c.source == "model" for c in cards)


def test_assistant_is_off_on_every_card(figma_result):
    assert not any(c.assistant_available for c in figma_result.conditions)


def test_several_red_flags_use_the_first_explanation():
    symptoms = symptoms_of("chest_pain", "sweating", "slurred_speech")
    flags = evaluate_red_flags(symptoms)
    assert [f.rule_id for f in flags] == ["heart_attack", "stroke"]
    result = build_emergency_result(flags, FIGMA_PREDICTIONS, symptoms)
    assert result.next_steps.explanation == flags[0].explanation


# ---------------------------------------------------------------------------
# Matching-symptom chips (computed from the dataset, no LLM)
# ---------------------------------------------------------------------------

def test_chips_are_the_users_symptoms_in_the_disease_profile(figma_result):
    heart = figma_result.conditions[0]
    # All three Figma symptoms are in heart attack's dataset profile
    assert [chip.label for chip in heart.matching_symptoms] == ["Chest pain", "Breathlessness", "Sweating"]
    assert all(chip.present for chip in heart.matching_symptoms)
    assert heart.why_this_match == "Matches your reported symptoms: chest pain, breathlessness, sweating."


def test_chips_exclude_symptoms_outside_the_profile():
    symptoms = symptoms_of("chest_pain", "sweating", "itching")  # itching isn't a heart attack symptom
    result = build_emergency_result(evaluate_red_flags(symptoms), FIGMA_PREDICTIONS[:1], symptoms)
    labels = [chip.label for chip in result.conditions[0].matching_symptoms]
    assert labels == ["Chest pain", "Sweating"]


def test_condition_with_no_matching_symptoms_gets_no_chips():
    symptoms = symptoms_of("slurred_speech")
    predictions = [ConditionScore(name="acne", probability=0.3)]
    result = build_emergency_result(evaluate_red_flags(symptoms), predictions, symptoms)
    assert result.conditions[0].matching_symptoms == []
    assert "None of your reported symptoms" in result.conditions[0].why_this_match


# ---------------------------------------------------------------------------
# Failure handling
# ---------------------------------------------------------------------------

def test_no_red_flags_raises():
    with pytest.raises(ValueError, match="at least one red-flag match"):
        build_emergency_result([], FIGMA_PREDICTIONS, FIGMA_SYMPTOMS)


def test_emergency_still_builds_without_predictions():
    # The model may be missing or fail; the emergency screen must still render
    result = build_emergency_result(evaluate_red_flags(FIGMA_SYMPTOMS), [], FIGMA_SYMPTOMS)
    assert result.triage_level == "emergency"
    assert result.conditions == []


# ---------------------------------------------------------------------------
# Contract change: empty conditions only allowed for emergencies
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("level, action", [("appointment", "find_care"), ("self_care", "find_pharmacy")])
def test_non_emergency_results_still_need_a_condition(level, action):
    with pytest.raises(ValidationError, match="need at least one condition"):
        TriageResult(
            triage_level=level,
            next_steps=NextSteps(headline="h", explanation="e", primary_action=action),
            conditions=[],
        )


def test_disease_profiles_example():
    assert disease_profiles()["heart attack"] == {"breathlessness", "chest_pain", "sweating", "vomiting"}
