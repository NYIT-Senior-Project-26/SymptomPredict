"""Tests for POST /api/v1/triage (app/api/routes/triage.py).

Run from backend/:  pytest tests/test_triage_api.py -v

The model is replaced with monkeypatch, so these run without a trained model
and always see the same predictions. Note WHERE it's patched: the route did
`from ml_layer.model import top_k_predictions`, so the name to replace is the
one inside the route module, `app.api.routes.triage.top_k_predictions`.
"""

import pytest
from fastapi.testclient import TestClient

import app.api.routes.triage as triage_route
from app.main import app
from shared import ConditionScore

client = TestClient(app)
URL = "/api/v1/triage"

DEMOGRAPHICS = {
    "age": 54,
    "sex": "male",
    "weight": 190,
    "blood_pressure": "high",
    "smoking_status": "former",
}


def body(*symptom_names: str, **demographic_overrides) -> dict:
    """Request JSON: given symptoms (severity 5) + default demographics."""
    return {
        "demographics": {**DEMOGRAPHICS, **demographic_overrides},
        "symptoms": [{"name": n, "severity": 5} for n in symptom_names],
    }


@pytest.fixture
def fake_model(monkeypatch):
    """Replace the model with a fake that records what it was called with."""
    calls = []

    def fake_top_k(symptoms, k=5):
        calls.append([s.name for s in symptoms])
        return [
            ConditionScore(name="heart attack", probability=0.54),
            ConditionScore(name="bronchial asthma", probability=0.20),
        ]

    monkeypatch.setattr(triage_route, "top_k_predictions", fake_top_k)
    return calls


# ---------------------------------------------------------------------------
# Emergency path
# ---------------------------------------------------------------------------

def test_figma_emergency_returns_emergency_screen(fake_model):
    r = client.post(URL, json=body("chest_pain", "breathlessness", "sweating"))
    assert r.status_code == 200
    data = r.json()
    assert data["triage_level"] == "emergency"
    assert data["next_steps"]["primary_action"] == "call_911"
    assert data["next_steps"]["secondary_action"] == "show_nearest_er"
    assert data["medication_guidance_allowed"] is False
    assert [c["name"] for c in data["conditions"]] == ["Heart attack", "Bronchial asthma"]
    assert data["conditions"][0]["match_label"] == "Moderate match"  # computed from 54
    assert "session_id" in data


def test_symptom_names_are_normalized(fake_model):
    r = client.post(URL, json=body("Slurred Speech"))
    assert r.status_code == 200
    assert r.json()["triage_level"] == "emergency"


def test_unknown_symptoms_are_skipped_not_fatal(fake_model):
    # "arm pain" isn't a dataset column (Figma: "pain spreading to arm")
    r = client.post(URL, json=body("chest_pain", "sweating", "arm pain"))
    assert r.status_code == 200
    assert fake_model == [["chest_pain", "sweating"]]  # model never saw "arm_pain"


def test_emergency_still_returned_when_the_model_fails(monkeypatch):
    def broken(symptoms, k=5):
        raise FileNotFoundError("no trained model")

    monkeypatch.setattr(triage_route, "top_k_predictions", broken)
    r = client.post(URL, json=body("chest_pain", "sweating"))
    assert r.status_code == 200
    assert r.json()["triage_level"] == "emergency"
    assert r.json()["conditions"] == []


# ---------------------------------------------------------------------------
# Not built yet
# ---------------------------------------------------------------------------

def test_non_emergency_is_501_until_three_tier_logic_exists(fake_model):
    r = client.post(URL, json=body("runny_nose", "continuous_sneezing"))
    assert r.status_code == 501
    assert fake_model == []  # no point running the model for an unbuilt path


# ---------------------------------------------------------------------------
# Input validation (FastAPI returns 422 from the Pydantic models)
# ---------------------------------------------------------------------------

@pytest.mark.parametrize(
    "bad_body",
    [
        {**body("chest_pain"), "symptoms": []},                               # no symptoms
        {"demographics": DEMOGRAPHICS, "symptoms": [{"name": "cough", "severity": 11}]},  # severity 1-10
        body("chest_pain", age=200),                                           # age range
        {"symptoms": [{"name": "cough", "severity": 3}]},                      # demographics missing
    ],
)
def test_invalid_input_is_422(bad_body):
    assert client.post(URL, json=bad_body).status_code == 422


def test_unknown_demographic_field_is_422():
    # shared models use extra="forbid": a typo'd key fails loudly
    r = client.post(URL, json=body("chest_pain", smoker=True))
    assert r.status_code == 422
