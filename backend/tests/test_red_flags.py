import pytest

from ml_layer.data import load_dataset
from shared import Symptom
from triage.red_flags import RED_FLAG_RULES, RedFlagRule, evaluate_red_flags

def fired(symptoms) -> list[str]:
    """Rule ids that fire for these symptoms, in priority order."""
    return [m.rule_id for m in evaluate_red_flags(symptoms)]


# ---------------------------------------------------------------------------
# Rules fire when they should
# ---------------------------------------------------------------------------

def test_figma_emergency_scenario():
    # Figma "Seek emergency care": chest pressure + shortness of breath + sweating
    # (+ "pain spreading to arm", which has no dataset column)
    assert fired(["chest_pain", "breathlessness", "sweating"]) == ["heart_attack"]


@pytest.mark.parametrize(
    "symptoms, rule_id",
    [
        # smallest input that should trigger each rule
        (["chest_pain", "breathlessness"], "heart_attack"),
        (["chest_pain", "palpitations"], "heart_attack"),
        (["weakness_of_one_body_side"], "stroke"),
        (["slurred_speech"], "stroke"),
        (["coma"], "reduced_consciousness"),
        (["altered_sensorium"], "reduced_consciousness"),
        (["stomach_bleeding"], "serious_bleeding"),
        (["blood_in_sputum"], "serious_bleeding"),
        (["high_fever", "stiff_neck"], "possible_meningitis"),
    ],
)
def test_each_rule_fires_on_its_minimal_trigger(symptoms, rule_id):
    assert fired(symptoms) == [rule_id]


def test_extra_symptoms_dont_stop_a_rule_firing():
    assert "stroke" in fired(["slurred_speech", "headache", "fatigue", "vomiting"])


def test_several_rules_all_reported_in_priority_order():
    result = fired(["high_fever", "stiff_neck", "slurred_speech", "chest_pain", "sweating"])
    assert result == ["heart_attack", "stroke", "possible_meningitis"]


def test_matched_symptoms_lists_only_the_triggers():
    [match] = evaluate_red_flags(["chest_pain", "sweating", "headache"])
    assert match.matched_symptoms == ["chest_pain", "sweating"]  # not headache


# ---------------------------------------------------------------------------
# Rules don't fire when they shouldn't
# ---------------------------------------------------------------------------

@pytest.mark.parametrize(
    "symptoms",
    [
        ["chest_pain"],            # needs a second warning sign (see open question 1)
        ["breathlessness"],        # second sign without chest pain
        ["high_fever"],            # meningitis needs both
        ["stiff_neck"],
        ["bloody_stool"],          # deliberately not a rule yet (open question 2)
    ],
)
def test_near_misses_do_not_fire(symptoms):
    assert fired(symptoms) == []


@pytest.mark.parametrize(
    "symptoms",
    [
        # Figma "Book an appointment" (strep-like) and "Self-care" (cold) scenarios
        ["high_fever", "patches_in_throat", "throat_irritation"],
        ["runny_nose", "continuous_sneezing", "congestion"],
        ["itching", "skin_rash", "nodal_skin_eruptions"],
    ],
)
def test_ordinary_cases_do_not_fire(symptoms):
    assert fired(symptoms) == []


def test_empty_input_does_not_fire():
    assert fired([]) == []


# ---------------------------------------------------------------------------
# Input handling
# ---------------------------------------------------------------------------

def test_names_are_normalized():
    assert fired(["Slurred Speech"]) == ["stroke"]
    assert fired(["  High Fever ", "stiff neck"]) == ["possible_meningitis"]


def test_accepts_symptom_objects():
    symptoms = [Symptom(name="chest_pain", severity=8), Symptom(name="sweating", severity=4)]
    assert fired(symptoms) == ["heart_attack"]


def test_input_order_does_not_matter():
    assert fired(["sweating", "chest_pain"]) == fired(["chest_pain", "sweating"])


# ---------------------------------------------------------------------------
# The rule data itself
# ---------------------------------------------------------------------------

def test_every_rule_symptom_is_a_dataset_column():
    # Catches typos: a misspelled symptom would make its rule silently never fire
    columns = set(load_dataset()[0].columns)
    for rule in RED_FLAG_RULES:
        unknown = (rule.all_of | rule.any_of) - columns
        assert not unknown, f"rule {rule.id!r} uses unknown symptoms {unknown}"


def test_rule_ids_are_unique():
    ids = [r.id for r in RED_FLAG_RULES]
    assert len(ids) == len(set(ids))


def test_every_rule_has_a_source_and_copy():
    for rule in RED_FLAG_RULES:
        assert rule.explanation.strip(), rule.id


def test_rule_with_no_symptoms_is_rejected():
    with pytest.raises(ValueError, match="has no symptoms"):
        RedFlagRule(id="bad", name="bad", explanation="x")
