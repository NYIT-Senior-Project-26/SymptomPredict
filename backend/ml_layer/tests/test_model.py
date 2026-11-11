import lightgbm
import numpy as np
import pandas as pd
import pytest
from sklearn.model_selection import train_test_split

from ml_layer.config import MODEL_PATH, SEED
from ml_layer.data import load_dataset
from ml_layer.model import build_symptom_row, load_model, make_lgbm, top_k_predictions
from shared import ConditionScore, Symptom

needs_model = pytest.mark.skipif(
    not MODEL_PATH.exists(),
    reason=f"no model at {MODEL_PATH}; from backend/ run: python -m ml_layer.train_model",
)

FUNGAL = ["itching", "skin_rash", "nodal_skin_eruptions"]

@pytest.fixture(scope="module")
def data() -> tuple[pd.DataFrame, pd.Series]:
    return load_dataset()

@pytest.fixture(scope="module")
def x(data) -> pd.DataFrame:
    return data[0]

@pytest.fixture(scope="module")
def y(data) -> pd.Series:
    return data[1]

@pytest.fixture(scope="module")
def model():
    return load_model()

@pytest.fixture(scope="module")
def split(x, y):
    """Fixed 80/20 split, stratified so every disease is on both sides."""
    return train_test_split(x, y, test_size=0.2, stratify=y, random_state=SEED)

# Saved model artifact

@needs_model
def test_model_is_lightgbm(model):
    assert isinstance(model, lightgbm.LGBMClassifier)

@needs_model
def test_model_features_match_dataset(model, x):
    # If this fails, the model was trained with different column cleaning than
    # data.py uses now: retrain it
    assert list(model.feature_names_in_) == list(x.columns)

@needs_model
def test_model_classes_match_dataset(model, y):
    assert set(model.classes_) == set(y.unique())

@needs_model
def test_predict_proba_is_valid_distribution(model, x):
    probs = model.predict_proba(x.head(20))
    assert probs.shape == (20, len(model.classes_))
    assert np.all((probs >= 0) & (probs <= 1))
    np.testing.assert_allclose(probs.sum(axis=1), 1.0)

@needs_model
def test_model_fits_training_data(model, x, y):
    # The saved model was fit on every row (plus dropout copies), so it should
    # almost never miss a full profile
    assert model.score(x, y) >= 0.95

@needs_model
def test_every_disease_is_predictable(model, x, y):
    # Each disease should be the top prediction for at least one of its own rows
    preds = pd.Series(model.predict(x), index=y.index)
    for disease in y.unique():
        assert (preds[y == disease] == disease).any(), f"{disease} never predicted"

@needs_model
def test_load_model_is_cached(model):
    # lru_cache: the model is read from disk once, then reused
    assert load_model() is model

def test_load_model_missing_file_gives_clear_error(tmp_path):
    with pytest.raises(FileNotFoundError, match="python -m ml_layer.train_model"):
        load_model(tmp_path / "nope.pkl")

# Generalization: fresh model, same settings (config.LGBM_PARAMS)

def test_generalizes_to_held_out_data(split):
    x_train, x_test, y_train, y_test = split
    fresh = make_lgbm().fit(x_train, y_train)
    assert fresh.score(x_test, y_test) >= 0.85

def test_beats_majority_class_baseline(split):
    x_train, x_test, y_train, y_test = split
    fresh = make_lgbm().fit(x_train, y_train)
    baseline = (y_test == y_train.mode()[0]).mean()
    assert fresh.score(x_test, y_test) > baseline * 5

def test_same_seed_gives_same_model(x, y):
    a = make_lgbm().fit(x, y)
    b = make_lgbm().fit(x, y)
    np.testing.assert_array_equal(a.predict_proba(x), b.predict_proba(x))

# build_symptom_row

def test_symptom_row_sets_only_the_given_symptoms(x):
    row = build_symptom_row(FUNGAL, x.columns)
    assert row.shape == (1, x.shape[1])
    assert set(row.columns[row.iloc[0] == 1]) == set(FUNGAL)

def test_symptom_row_normalizes_strings_and_accepts_symptom_objects(x):
    # "Skin Rash" -> "skin_rash"; the CSV's "foul_smell_of urine" -> "foul_smell_of_urine"
    from_strings = build_symptom_row(["Skin Rash", "foul smell of urine"], x.columns)
    from_objects = build_symptom_row(
        [Symptom(name="skin_rash", severity=2), Symptom(name="foul_smell_of_urine", severity=2)], x.columns
    )
    pd.testing.assert_frame_equal(from_strings, from_objects)
    assert from_strings.iloc[0].sum() == 2

def test_symptom_row_rejects_unknown_symptom(x):
    with pytest.raises(ValueError, match="Unknown symptom"):
        build_symptom_row(["not_a_symptom"], x.columns)

# top_k_predictions

@pytest.fixture(scope="module")
def fresh_model(x, y):
    return make_lgbm().fit(x, y)

@pytest.mark.parametrize("k", [1, 3, 5])
def test_top_k_returns_k_condition_scores(fresh_model, k):
    result = top_k_predictions(FUNGAL, k, model=fresh_model)
    assert len(result) == k
    assert all(isinstance(r, ConditionScore) for r in result)

def test_top_k_first_result_matches_predict(fresh_model, x):
    row = build_symptom_row(FUNGAL, x.columns)
    assert top_k_predictions(FUNGAL, 3, model=fresh_model)[0].name == fresh_model.predict(row)[0]

def test_top_k_is_sorted_descending(fresh_model):
    probs = [r.probability for r in top_k_predictions(FUNGAL, 5, model=fresh_model)]
    assert probs == sorted(probs, reverse=True)

def test_top_k_probabilities_match_model(fresh_model, x):
    row = build_symptom_row(FUNGAL, x.columns)
    expected = dict(zip(fresh_model.classes_, fresh_model.predict_proba(row)[0]))
    for r in top_k_predictions(FUNGAL, 3, model=fresh_model):
        assert r.probability == pytest.approx(expected[r.name])

def test_top_k_larger_than_class_count(fresh_model):
    k = len(fresh_model.classes_) + 10
    assert len(top_k_predictions(FUNGAL, k, model=fresh_model)) == len(fresh_model.classes_)

def test_top_k_rejects_empty_symptom_list(fresh_model):
    with pytest.raises(ValueError, match="At least one symptom"):
        top_k_predictions([], 5, model=fresh_model)

def test_match_score_is_probability_as_0_to_100():
    assert ConditionScore(name="flu", probability=0.9988).match_score == 100
    assert ConditionScore(name="flu", probability=0.476).match_score == 48
    assert ConditionScore(name="flu", probability=0.00006).match_score == 0