import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.prediction import engine, ml_model
from app.prediction.claude_client import build_user_content
from app.prediction.symptom_map import ANSWER_KEYS, SYMPTOM_KEYS, match_symptoms
from app.schemas.prediction import PredictionResult, SymptomInput
from ml_layer.config import MODEL_PATH
from ml_layer.data import load_dataset

client = TestClient(app)
needs_model = pytest.mark.skipif(
    not MODEL_PATH.exists(), reason="no trained model; run python -m ml_layer.train_model"
)
DATASET_SYMPTOMS = set(load_dataset()[0].columns)


def test_every_mapped_symptom_is_in_the_dataset():
    mapped = {k for keys in SYMPTOM_KEYS.values() for k in keys}
    mapped |= {k for options in ANSWER_KEYS.values() for keys in options.values() for k in keys}
    assert mapped - DATASET_SYMPTOMS == set()


def test_match_splits_matched_and_unmatched():
    m = match_symptoms(
        ["Rash", "Ear pain", "skin rash", "itching", "  "],
        {"tn-cold": ["Sneezing", "None of these"], "unknown-question": ["Yes"]},
        DATASET_SYMPTOMS,
    )
    assert m.matched == ["Rash", "skin rash", "itching"]  # chip label, typed dataset names
    assert m.unmatched == ["Ear pain"]
    assert m.keys == ["skin_rash", "itching", "continuous_sneezing"]  # no duplicates


def test_claude_sees_coverage_and_unmatched_symptoms():
    data = SymptomInput(symptoms=["Rash", "Ear pain"])
    ranking = ml_model.Ranking(True, [], ["skin_rash"], ["Rash"], ["Ear pain"])
    content = build_user_content(data, ranking)
    assert content["ml_model"]["coverage"] == "1 of 2 reported symptoms"
    assert content["unmatched_symptoms"] == ["Ear pain"]


@needs_model
def test_rank_with_only_unmatched_symptoms():
    ranking = ml_model.rank(["Ear pain", "Hoarse voice"], {})
    assert ranking.available
    assert ranking.candidates == []
    assert ranking.unmatched == ["Ear pain", "Hoarse voice"]


@needs_model
def test_predict_returns_ranking_and_unmatched(monkeypatch):
    seen = {}

    async def fake_claude(data, ranking):
        seen["ranking"] = ranking
        return PredictionResult(
            conditions=[
                {
                    "name": "Fungal infection",
                    "likelihood": "high",
                    "description": "A skin infection caused by fungus.",
                    "matching_symptoms": ["Rash", "Itching"],
                    "rationale": "Itchy rash.",
                }
            ],
            urgency="self_care",
            next_step="Treat it at home",
            recommended_specialty="Dermatology",
            advice="Keep the area dry.",
            warning_signs=["Rash spreads quickly"],
        )

    monkeypatch.setattr(engine, "analyze_symptoms", fake_claude)
    r = client.post(
        "/api/v1/predict",
        json={
            "symptoms": ["Rash", "itching", "Ear pain"],
            "follow_up_answers": {"fever": ["No"]},
        },
    )

    assert r.status_code == 200
    body = r.json()
    assert body["model_symptoms"] == ["skin_rash", "itching"]
    assert body["unmatched_symptoms"] == ["Ear pain"]
    assert body["model_candidates"][0]["name"] == "fungal infection"
    assert seen["ranking"].unmatched == ["Ear pain"]


def test_predict_without_model_sends_everything_as_unmatched(monkeypatch):
    monkeypatch.setattr(ml_model, "_load", lambda: None)
    ranking = ml_model.rank(["Rash", "Fever"], {"fever": ["Yes"]})
    assert not ranking.available
    assert ranking.candidates == []
    assert ranking.unmatched == ["Rash", "Fever"]
