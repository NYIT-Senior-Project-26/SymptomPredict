import importlib
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Tests for the random forest model and the top-k prediction helper.
# Run from the repo root: .venv/bin/python -m pytest ml-layer/tests

ML_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = ML_DIR.parent
DATASET_PATH = ML_DIR / "data" / "dataset.csv"
MODEL_PATH = ML_DIR / "models" / "rf_model.pkl"
LABEL = "prognosis"

# The .pkl is gitignored, so skip instead of failing on a fresh clone
pytestmark = pytest.mark.skipif(
    not MODEL_PATH.exists(),
    reason="rf_model.pkl not found; run ml-layer/src/train_model.py first",
)


def clean_name(name: str) -> str:
    return name.strip().lower().replace(" ", "")


# Fixtures

@pytest.fixture(scope="module")
def clean_data() -> pd.DataFrame:
    # Same normalization as train_model.py
    clean = pd.read_csv(DATASET_PATH)
    clean.columns = [clean_name(c) for c in clean.columns]
    clean[LABEL] = clean[LABEL].str.strip().str.lower()
    return clean.drop_duplicates().reset_index(drop=True)


@pytest.fixture(scope="module")
def x(clean_data) -> pd.DataFrame:
    return clean_data.drop(columns=[LABEL])


@pytest.fixture(scope="module")
def y(clean_data) -> pd.Series:
    return clean_data[LABEL]


@pytest.fixture(scope="module")
def predict_models():
    # predict_models.py loads the model with a path relative to the repo root,
    # so it has to be imported from there
    mp = pytest.MonkeyPatch()
    mp.chdir(REPO_ROOT)
    mp.syspath_prepend(str(ML_DIR / "src"))
    sys.modules.pop("predict_models", None)
    module = importlib.import_module("predict_models")
    yield module
    mp.undo()


@pytest.fixture(scope="module")
def model(predict_models) -> RandomForestClassifier:
    return predict_models.rf_model


def make_row(x: pd.DataFrame, symptoms: list[str]) -> pd.DataFrame:
    row = pd.DataFrame(np.zeros((1, x.shape[1]), dtype=int), columns=x.columns)
    row.loc[0, symptoms] = 1
    return row


# Model artifact

def test_model_is_random_forest(model):
    assert isinstance(model, RandomForestClassifier)


def test_model_features_match_dataset(model, x):
    assert model.n_features_in_ == x.shape[1]
    assert list(model.feature_names_in_) == list(x.columns)


def test_model_classes_match_dataset(model, y):
    assert set(model.classes_) == set(y.unique())


def test_predict_proba_is_valid_distribution(model, x):
    probs = model.predict_proba(x.head(20))
    assert probs.shape == (20, len(model.classes_))
    assert np.all((probs >= 0) & (probs <= 1))
    np.testing.assert_allclose(probs.sum(axis=1), 1.0)


def test_predictions_are_deterministic(model, x):
    sample = x.head(50)
    np.testing.assert_array_equal(model.predict_proba(sample), model.predict_proba(sample))


def test_model_fits_training_data(model, x, y):
    # Saved model was fit on the whole dataset, so it should almost never miss
    assert model.score(x, y) >= 0.95


def test_every_disease_is_predictable(model, x, y):
    # Each disease should be the top prediction for at least one of its own rows
    preds = pd.Series(model.predict(x), index=y.index)
    for disease in y.unique():
        assert (preds[y == disease] == disease).any(), f"{disease} never predicted"


def test_rejects_wrong_feature_count(model, x):
    with pytest.raises(ValueError):
        model.predict(x.iloc[:1, :-1])


# Generalization (fresh model, same settings as train_model.py)

def test_generalizes_to_held_out_data(x, y):
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, stratify=y, random_state=42
    )
    fresh = RandomForestClassifier(random_state=42).fit(x_train, y_train)
    assert fresh.score(x_test, y_test) >= 0.85


def test_beats_majority_class_baseline(x, y):
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, stratify=y, random_state=42
    )
    fresh = RandomForestClassifier(random_state=42).fit(x_train, y_train)
    baseline = (y_test == y_train.mode()[0]).mean()
    assert fresh.score(x_test, y_test) > baseline * 5


def test_same_seed_gives_same_model(x, y):
    a = RandomForestClassifier(n_estimators=20, random_state=42).fit(x, y)
    b = RandomForestClassifier(n_estimators=20, random_state=42).fit(x, y)
    np.testing.assert_array_equal(a.predict_proba(x), b.predict_proba(x))


# print_top_k_prediction_rf
# Assumes the return value maps disease name -> probability

@pytest.mark.parametrize("k", [1, 3, 5])
def test_top_k_returns_k_results(predict_models, model, x, k):
    row = x.iloc[[0]]
    result = predict_models.print_top_k_prediction_rf(row, k, model=model)
    assert len(result) == k


def test_top_k_first_result_matches_predict(predict_models, model, x):
    row = x.iloc[[0]]
    result = predict_models.print_top_k_prediction_rf(row, 3, model=model)
    assert next(iter(result)) == model.predict(row)[0]


def test_top_k_is_sorted_descending(predict_models, model, x):
    row = x.iloc[[0]]
    result = predict_models.print_top_k_prediction_rf(row, 5, model=model)
    probs = list(result.values())
    assert probs == sorted(probs, reverse=True)


def test_top_k_probabilities_match_model(predict_models, model, x):
    row = x.iloc[[0]]
    result = predict_models.print_top_k_prediction_rf(row, 3, model=model)
    expected = dict(zip(model.classes_, model.predict_proba(row)[0]))
    for disease, prob in result.items():
        assert prob == pytest.approx(expected[disease])


def test_top_k_handles_hand_built_symptoms(predict_models, model, x):
    row = make_row(x, ["itching", "skin_rash", "nodal_skin_eruptions"])
    result = predict_models.print_top_k_prediction_rf(row, 3, model=model)
    assert len(result) == 3
    assert all(disease in model.classes_ for disease in result)


def test_top_k_larger_than_class_count(predict_models, model, x):
    row = x.iloc[[0]]
    k = len(model.classes_) + 10
    result = predict_models.print_top_k_prediction_rf(row, k, model=model)
    assert len(result) == len(model.classes_)
