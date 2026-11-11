import numpy as np
import pytest
from dataclasses import dataclass
from sklearn.preprocessing import LabelEncoder
from ml_layer.compare_models import make_rf, make_xgb
from ml_layer.config import MODEL_PATH
from ml_layer.data import load_dataset
from ml_layer.model import build_symptom_row, load_model

MODELS_EXIST = MODEL_PATH.exists()

pytestmark = pytest.mark.skipif(
    not MODELS_EXIST, reason=f"no model at {MODEL_PATH}; from backend/ run: python -m ml_layer.train_model"
)

MODEL_NAMES = ["rf", "xgb", "lgbm"]

# Symptom sets
# A dataclass keeps each case self-describing; adding a case is one entry in CASES.
# frozen=True makes instances immutable (and hashable), which suits test data.

@dataclass(frozen=True)
class SymptomCase:
    id: str              # shows up in pytest output, e.g. "pneumonia-minimal-rf"
    target: str          # the disease these symptoms describe (dataset label, lowercase)
    symptoms: tuple[str, ...]
    max_rank: int        # target must appear at this rank or better


CASES = [
    # --- Pneumonia (11-symptom profile) ------------------------------------
    SymptomCase(
        "pneumonia-full", "pneumonia",
        ("chills", "fatigue", "cough", "high_fever", "breathlessness", "sweating",
         "malaise", "phlegm", "chest_pain", "fast_heart_rate", "rusty_sputum"),
        max_rank=1,
        # Observed: rank 1 in all models (RF 1.00, XGB 0.96, LGBM 1.00)
    ),
    SymptomCase(
        "pneumonia-partial", "pneumonia",
        ("cough", "high_fever", "breathlessness", "rusty_sputum"),
        max_rank=3,
        # Observed: RF rank 2 (asthma 0.34 > pneumonia 0.22), XGB rank 1 (0.49), LGBM rank 1 (0.79)
        # rusty_sputum is unique to pneumonia, which is what rescues this case.
    ),
    SymptomCase(
        "pneumonia-minimal", "pneumonia",
        ("cough", "high_fever", "breathlessness"),
        max_rank=5,
        # Observed (before augmentation): RF not in top 5, XGB rank 4, LGBM not in top 5 (asthma 0.99!)
        # Observed (2026-11-11): RF #16, XGB #9, LGBM augmented #2
        # Why: bronchial asthma's profile also contains all 3 symptoms and is
        # smaller (6 symptoms vs 11), so a 3-symptom row looks more like asthma.
        # Same "0 means absent, not unmentioned" problem as the common-cold case.
    ),

    # --- Migraine (9-symptom profile) --------------------------------------
    SymptomCase(
        "migraine-full", "migraine",
        ("acidity", "indigestion", "headache", "blurred_and_distorted_vision",
         "excessive_hunger", "stiff_neck", "depression", "irritability",
         "visual_disturbances"),
        max_rank=1,
        # Observed: rank 1 in all models (RF 1.00, XGB 0.98, LGBM 1.00)
    ),
    SymptomCase(
        "migraine-partial", "migraine",
        ("headache", "visual_disturbances", "stiff_neck", "irritability"),
        max_rank=3,
        # Observed: rank 1 in all models (RF 0.49, XGB 0.20, LGBM 1.00)
    ),
    SymptomCase(
        "migraine-minimal", "migraine",
        ("headache", "visual_disturbances"),
        max_rank=5,
        # Observed: RF rank 2, XGB rank 2 (both behind "paralysis (brain hemorrhage)"),
        #           LGBM rank 1 (0.85)
    ),

    # --- Diabetes (10-symptom profile) -------------------------------------
    SymptomCase(
        "diabetes-full", "diabetes",
        ("fatigue", "weight_loss", "restlessness", "lethargy", "irregular_sugar_level",
         "blurred_and_distorted_vision", "obesity", "excessive_hunger",
         "increased_appetite", "polyuria"),
        max_rank=1,
        # Observed: rank 1 in all models (RF 1.00, XGB 0.97, LGBM 1.00)
    ),
    SymptomCase(
        "diabetes-partial", "diabetes",
        ("irregular_sugar_level", "polyuria", "increased_appetite", "excessive_hunger"),
        max_rank=3,
        # Observed: rank 1 in all models (RF 0.62, XGB 0.75, LGBM 1.00)
    ),
    SymptomCase(
        "diabetes-minimal", "diabetes",
        ("polyuria", "excessive_hunger"),
        max_rank=5,
        # Observed: rank 1 in all models (RF 0.31, XGB 0.12, LGBM 0.62)
    ),
]

# (case id, model) pairs that currently fail. They are marked xfail so they
# document a weakness instead of breaking the suite. strict=False means a
# later model that passes shows up as XPASS, telling you to remove the entry.
# Updated 2026-11-11 after LightGBM switched to augmented training (augment.py):
# LGBM now ranks pneumonia #2 here, so its entry was removed. RF and XGB are trained
# without augmentation and stay as baselines.
KNOWN_FAILURES = {
    ("pneumonia-minimal", "rf"): "pneumonia #16; asthma wins on 3 shared symptoms (no augmentation)",
    # Machine-dependent: #9 on some machines, #4 on others (shows as XPASS there)
    ("pneumonia-minimal", "xgb"): "pneumonia drops out of the top 5 on some machines (no augmentation)",
}


# ---------------------------------------------------------------------------
# Model loading + ranking
# ---------------------------------------------------------------------------

def load_models() -> dict:
    """Return {name: (model, class_names)}.

    Baselines are fit on the plain (unaugmented) dataset, like the saved models
    used to be. XGBoost needs integer labels, so its names come from a LabelEncoder.
    """
    x, y = load_dataset()
    rf = make_rf().fit(x, y)
    encoder = LabelEncoder()
    xgb = make_xgb().fit(x, encoder.fit_transform(y))
    lgbm = load_model()
    return {
        "rf": (rf, rf.classes_),
        "xgb": (xgb, encoder.classes_),
        "lgbm": (lgbm, lgbm.classes_),
    }


MODELS = load_models() if MODELS_EXIST else {}


def rank_diseases(model_name: str, symptoms: tuple[str, ...]) -> list[tuple[str, float]]:
    """All diseases, best first, as (name, probability)."""
    model, class_names = MODELS[model_name]
    # build_symptom_row raises on an unknown name, which guards typos in CASES
    row = build_symptom_row(list(symptoms), MODELS["lgbm"][0].feature_names_in_)
    probs = model.predict_proba(row)[0]
    order = np.argsort(probs)[::-1]
    return [(str(class_names[i]), float(probs[i])) for i in order]


def target_rank(case: SymptomCase, model_name: str) -> tuple[int, float]:
    """1-based rank of the target disease and its probability."""
    ranked = rank_diseases(model_name, case.symptoms)
    for position, (name, prob) in enumerate(ranked, start=1):
        if name == case.target:
            return position, prob
    raise AssertionError(f"{case.target!r} is not a class in model {model_name!r}")


# ---------------------------------------------------------------------------
# The matrix
# ---------------------------------------------------------------------------
# Built by hand instead of stacking two @parametrize decorators, because each
# (case, model) PAIR may need its own xfail mark.
# Docs: https://docs.pytest.org/en/stable/how-to/parametrize.html

def matrix_params() -> list:
    params = []
    for case in CASES:
        for model_name in MODEL_NAMES:
            reason = KNOWN_FAILURES.get((case.id, model_name))
            marks = [pytest.mark.xfail(reason=reason, strict=False)] if reason else []
            params.append(pytest.param(case, model_name, id=f"{case.id}-{model_name}", marks=marks))
    return params


@pytest.mark.parametrize("case, model_name", matrix_params())
def test_target_disease_ranks_high_enough(case: SymptomCase, model_name: str):
    position, prob = target_rank(case, model_name)
    assert position <= case.max_rank, (
        f"{case.target} ranked #{position} (p={prob:.2f}), needed top {case.max_rank}"
    )


@pytest.mark.parametrize("case", [c for c in CASES if c.max_rank == 1], ids=lambda c: c.id)
def test_models_agree_on_full_presentations(case: SymptomCase):
    # For complete symptom profiles, all three models should name the same #1.
    # Disagreement here would point to a training or label-mapping bug.
    top_picks = {m: rank_diseases(m, case.symptoms)[0][0] for m in MODEL_NAMES}
    assert len(set(top_picks.values())) == 1, top_picks


# ---------------------------------------------------------------------------
# Comparison table (not a test): python -m ml_layer.tests.test_symptom_matrix
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    header = f"{'case':<20}" + "".join(f"{m:>16}" for m in MODEL_NAMES)
    print(header)
    print("-" * len(header))
    for case in CASES:
        cells = []
        for m in MODEL_NAMES:
            pos, prob = target_rank(case, m)
            mark = "" if pos <= case.max_rank else " x"  # x = misses this level's bar
            cells.append(f"#{pos} ({prob:.2f}){mark}")
        print(f"{case.id:<20}" + "".join(f"{c:>16}" for c in cells))
    print("\n#rank (probability of the target disease); x = outside required rank")
