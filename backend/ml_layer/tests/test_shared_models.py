import pytest
from datetime import date
from pydantic import ValidationError

from shared import (
    Allergy,
    AllergyCategory,
    BloodPressure,
    Demographic,
    DosageUnit,
    ExistingCondition,
    Frequency,
    Medication,
    Sex,
    SmokingStatus,
    Symptom,
    normalize_symptom_name,
)

def make_demo(**overrides) -> Demographic:
    """Valid Demographic with defaults; tests override one field at a time."""
    fields = dict(
        age=30,
        sex=Sex.MALE,
        weight=140,
        blood_pressure=BloodPressure.HIGH,
        smoking_status=SmokingStatus.NEVER,
    )
    fields.update(overrides)
    return Demographic(**fields)

# Symptoms

@pytest.mark.parametrize("severity", [0, 11, True, "7", 5.5])
def test_symptom_rejects_bad_severity(severity):
    with pytest.raises(ValidationError):
        Symptom(name="cough", severity=severity)

def test_symptom_validates_on_assignment():
    # validate_assignment=True keeps the old setter behavior
    s = Symptom(name="cough", severity=5)
    with pytest.raises(ValidationError):
        s.severity = 15

@pytest.mark.parametrize(
    "raw, expected",
    [
        ("Skin Rash", "skin_rash"),
        ("  high_fever ", "high_fever"),
        ("spotting_ urination", "spotting_urination"),
        ("foul_smell_of urine", "foul_smell_of_urine"),
        ("dischromic _patches", "dischromic_patches"),
    ],
)
def test_normalize_symptom_name(raw, expected):
    assert normalize_symptom_name(raw) == expected
    assert Symptom(name=raw, severity=3).name == expected

def test_symptom_rejects_blank_name():
    with pytest.raises(ValidationError):
        Symptom(name="  _ ", severity=3)


# Medications

def test_medication_dosage_and_unit_must_pair():
    with pytest.raises(ValidationError):
        Medication(name="Lisinopril", frequency=Frequency.ONCE_DAILY, dosage=10)
    with pytest.raises(ValidationError):
        Medication(name="Lisinopril", frequency=Frequency.ONCE_DAILY, unit=DosageUnit.MG)
    # Both or neither is fine
    Medication(name="Lisinopril", frequency=Frequency.ONCE_DAILY)
    Medication(name="Lisinopril", frequency=Frequency.ONCE_DAILY, dosage=10, unit=DosageUnit.MG)

@pytest.mark.parametrize("dosage", [0, -5, True])
def test_medication_rejects_bad_dosage(dosage):
    with pytest.raises(ValidationError):
        Medication(name="X", frequency=Frequency.AS_NEEDED, dosage=dosage, unit=DosageUnit.MG)

def test_medication_strips_name_and_str_matches_original_format():
    m = Medication(name="  Lisinopril ", frequency="once daily", dosage=10, unit="mg")
    assert m.name == "Lisinopril"
    assert str(m) == "Lisinopril 10 mg, oral, once daily (prescribed)"

# Allergies / ExistingConditions

def test_allergy_rejects_empty_allergen_and_reaction():
    with pytest.raises(ValidationError):
        Allergy(allergen="   ", category=AllergyCategory.FOOD)
    with pytest.raises(ValidationError):
        Allergy(allergen="Peanuts", category=AllergyCategory.FOOD, reaction="  ")

@pytest.mark.parametrize("year", [1899, date.today().year + 1, True, 2019.5])
def test_condition_rejects_bad_year(year):
    with pytest.raises(ValidationError):
        ExistingCondition(name="Hypertension", year_diagnosed=year)

# Demographics

@pytest.mark.parametrize("field, value", [("age", 4), ("age", 81), ("weight", 34), ("weight", True)])
def test_demographic_range_checks(field, value):
    with pytest.raises(ValidationError):
        make_demo(**{field: value})

def test_demographic_rejects_unknown_fields():
    # extra="forbid": a typo'd key from the frontend fails loudly
    with pytest.raises(ValidationError):
        make_demo(smoker=True)

def test_demographic_accepts_json_strings_and_dumps_back():
    # This is the shape the API will receive from the app
    demo = Demographic.model_validate(
        {
            "age": 54,
            "sex": "male",
            "weight": 190,
            "blood_pressure": "high",
            "smoking_status": "former",
            "conditions": [{"name": "Hypertension", "status": "managed", "year_diagnosed": 2019}],
        }
    )
    assert demo.blood_pressure is BloodPressure.HIGH
    dumped = demo.model_dump(mode="json")
    assert dumped["blood_pressure"] == "high"
    assert dumped["conditions"][0]["status"] == "managed"