import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import log_loss, top_k_accuracy_score
from sklearn.model_selection import RepeatedStratifiedKFold
from sklearn.preprocessing import LabelEncoder
from ml_layer.augment import augment_with_dropout
from ml_layer.config import RESULTS_DIR, SEED
from ml_layer.data import load_dataset
from ml_layer.model import make_lgbm

# Config

RESULTS_PATH = RESULTS_DIR / "model_comparison.csv"

# How many symptoms each test row keeps
SYMPTOM_LEVELS = ["all", 1, 2, 3, 5]

N_SPLITS = 5 # folds per repeat; the smallest disease has 5 rows, so 5 is the max
N_REPEATS = 3 # reshuffle and redo the folds this many times -> 15 scores per metric

# Data

def load_data() -> tuple[np.ndarray, np.ndarray, LabelEncoder]:
    """Same cleaned, deduplicated data as training (ml_layer/data.py), as numpy arrays."""
    x, y = load_dataset()

    # Every model gets integer labels 0..40, not just XGBoost. That way all
    # models output probability columns in the same order, and the metric code
    # below doesn't need a per-model special case.
    encoder = LabelEncoder()
    return x.to_numpy(), encoder.fit_transform(y), encoder


# Models

def make_rf():
    return RandomForestClassifier(random_state=SEED)

def make_xgb():
    return xgb.XGBClassifier(random_state=SEED, max_depth=3, colsample_bytree=0.5, subsample=0.8)

def make_rf_calibrated():
    return CalibratedClassifierCV(make_rf(), method="sigmoid", cv=3)


MODELS = {
    "rf": make_rf,
    "xgb": make_xgb,
    "lgbm": make_lgbm,
    "rf_calibrated": make_rf_calibrated,
    "rf_augmented": make_rf,
    "lgbm_augmented": make_lgbm,
}

# Which MODELS entries get their training fold augmented before fitting
AUGMENTED = {"rf_augmented", "lgbm_augmented"}

# Symptom masking

def keep_k_symptoms(x: np.ndarray, k, rng: np.random.Generator) -> np.ndarray:
    if k == "all":
        return x.copy()
    masked = np.zeros_like(x)
    for i, row in enumerate(x):
        present = np.flatnonzero(row)                          # indexes of 1s
        keep = rng.choice(present, size=min(k, len(present)), replace=False)
        masked[i, keep] = 1
    return masked

# Evaluation

def full_proba(model, x: np.ndarray, n_classes: int) -> np.ndarray:
    proba = np.zeros((len(x), n_classes))
    proba[:, model.classes_] = model.predict_proba(x)
    return proba

def evaluate() -> pd.DataFrame:
    x, y, encoder = load_data()
    labels = np.arange(len(encoder.classes_))
    print(f"Dataset: {len(x)} unique rows, {x.shape[1]} symptoms, {len(labels)} diseases")

    cv = RepeatedStratifiedKFold(n_splits=N_SPLITS, n_repeats=N_REPEATS, random_state=SEED)
    rng = np.random.default_rng(SEED)
    records = []

    for fold, (train_idx, test_idx) in enumerate(cv.split(x, y)):
        x_test, y_test = x[test_idx], y[test_idx]

        masked = {k: keep_k_symptoms(x_test, k, rng) for k in SYMPTOM_LEVELS}

        x_train_aug, y_train_aug = augment_with_dropout(x[train_idx], y[train_idx], seed=SEED + fold)

        for name, make_model in MODELS.items():
            if name in AUGMENTED:
                model = make_model().fit(x_train_aug, y_train_aug)
            else:
                model = make_model().fit(x[train_idx], y[train_idx])
            for k, x_masked in masked.items():
                proba = full_proba(model, x_masked, len(labels))
                records.append({
                    "fold": fold,
                    "model": name,
                    "symptoms_kept": str(k),
                    "top1": top_k_accuracy_score(y_test, proba, k=1, labels=labels),
                    "top5": top_k_accuracy_score(y_test, proba, k=5, labels=labels),
                    "log_loss": log_loss(y_test, proba, labels=labels),
                })
        print(f"  fold {fold + 1}/{N_SPLITS * N_REPEATS} done")

    return pd.DataFrame(records)

def summarize(results: pd.DataFrame) -> pd.DataFrame:
    """Mean and std of each metric per (symptom level, model)."""
    summary = (
        results.groupby(["symptoms_kept", "model"])[["top1", "top5", "log_loss"]]
        .agg(["mean", "std"])
    )
    # Order rows as listed in the config, not alphabetically ("1" < "2" < "all")
    level_order = [str(k) for k in SYMPTOM_LEVELS]
    return summary.reindex(
        pd.MultiIndex.from_product([level_order, list(MODELS)], names=summary.index.names)
    )

def print_summary(summary: pd.DataFrame) -> None:
    print(f"\n{'kept':>5} {'model':>14} {'top1':>14} {'top5':>14} {'log loss':>14}")
    for (level, model), row in summary.iterrows():
        cells = [f"{row[(m, 'mean')]:.3f} ±{row[(m, 'std')]:.3f}" for m in ("top1", "top5", "log_loss")]
        print(f"{level:>5} {model:>14} " + " ".join(f"{c:>14}" for c in cells))
    print("\ntop1/top5: higher is better. log loss: lower is better. ± = std across folds.")

if __name__ == "__main__":
    results = evaluate()
    summary = summarize(results)
    print_summary(summary)

    RESULTS_PATH.parent.mkdir(parents=True, exist_ok=True)
    summary.to_csv(RESULTS_PATH)
    print(f"\nSaved summary to {RESULTS_PATH}")
