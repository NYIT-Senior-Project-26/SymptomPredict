import argparse
import pandas as pd
import xgboost as xgb
import joblib
import lightgbm
from pathlib import Path
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Specifically used to just train the model off of the symbipredict-2022 dataset
# Data set link:
# https://www.kaggle.com/datasets/manvivemula/symbipredict-2022

# Load up dataset
# Set dataset path
root_dir = Path(__file__).resolve().parent
dataset_path = root_dir.parent / "data" / "dataset.csv"
model_dir = root_dir.parent.parent / "models"   # backend/models, shared with the API
raw = pd.read_csv(dataset_path)

# This is the target column in the CSV
LABEL = "prognosis"

# Dataset normalization
clean = raw.copy()

def clean_name(name: str) -> str:
    return name.strip().lower().replace(" ", "")

clean.columns = [clean_name(c) for c in clean.columns]
LABEL = clean_name(LABEL)

# Labels keep their internal spaces ("urinary tract infection") so they stay readable;
# only the ends are stripped and the case is unified
clean[LABEL] = clean[LABEL].str.strip().str.lower()

before = len(clean)
clean = clean.drop_duplicates().reset_index(drop=True)
counts = clean[LABEL].value_counts()

# Verification
assert clean.isna().sum().sum() == 0
assert set(pd.unique(clean.drop(columns=[LABEL]).values.ravel())) <= {0, 1}
assert all(c == clean_name(c) for c in clean.columns)

# Split features / label
# Drop LABEL column; drop a single column
x = clean.drop(columns=[LABEL])
y = clean[LABEL]

# XGBoost (3.x) rejects string labels, so it trains on integers 0..n-1.
# The encoder's classes_ is the mapping back to disease names and is saved with the model.
le = LabelEncoder()
y_encoded = le.fit_transform(y)


# Cross validation
# 5 splits is the default. add 'n_splits=x" if changes are desired
cv = StratifiedKFold(shuffle=True, random_state=42)

# Model settings
# Kept here in one place so they're easy to compare and to cite in the writeup.
# The dataset is tiny (304 rows, 41 classes, 5-10 rows per class), so the boosting
# libraries' defaults (built for much larger data) don't fit it:
#   - LightGBM defaults (min_child_samples=20, etc.) barely split: ~0.69 CV accuracy.
#     Smaller leaf/bin minimums plus row + column subsampling: ~0.99.
#   - XGBoost defaults: ~0.88. Shallower trees plus row + column subsampling: ~0.997.
# Column subsampling is what matters most for both. These were picked by comparing
# a handful of settings on the same CV folds, so treat the scores as slightly optimistic.
MODEL_CONFIGS = {
    "rf": {
        "estimator": RandomForestClassifier,
        "params": {
            "random_state": 42,
        },
        "encode_labels": False,
    },
    "xgb": {
        "estimator": xgb.XGBClassifier,
        "params": {
            "random_state": 42,
            "max_depth": 3,
            "colsample_bytree": 0.5,
            "subsample": 0.8,
        },
        "encode_labels": True,
    },
    "lgbm": {
        "estimator": lightgbm.LGBMClassifier,
        "params": {
            "random_state": 42,
            "num_leaves": 8,
            "min_child_samples": 2,
            "min_data_in_bin": 1,
            "min_sum_hessian_in_leaf": 0,
            "colsample_bytree": 0.5,
            "subsample": 0.8,
            "subsample_freq": 1,    # subsample does nothing unless this is > 0
            "verbose": -1,          # silence per-iteration [Info] logs; set to 1 when tuning
        },
        "encode_labels": False,    # LightGBM accepts string labels directly
    },
}

def build_model(name: str):
    config = MODEL_CONFIGS[name]
    return config["estimator"](**config["params"])

def labels_for(name: str):
    return y_encoded if MODEL_CONFIGS[name]["encode_labels"] else y

# Model eval
# cross_val_score clones and refits the model on each fold, so no fit is needed beforehand
def evaluate_models() -> dict:
    scores = {}
    for name in MODEL_CONFIGS:
        fold_scores = cross_val_score(build_model(name), x, labels_for(name), cv=cv)
        scores[name] = fold_scores
        print(f"{name:>5}: mean={fold_scores.mean():.3f} std={fold_scores.std():.3f} folds={fold_scores.round(3)}")
    return scores

# Fit once on all the data and save. Only run after picking settings above.
def fit_and_save() -> None:
    model_dir.mkdir(parents=True, exist_ok=True)

    for name in MODEL_CONFIGS:
        model = build_model(name)
        model.fit(x, labels_for(name))

        # The row builder and Symptom validation in llm.py depend on feature_names_in_
        assert list(model.feature_names_in_) == list(x.columns), f"{name}: feature names don't match dataset"
        print(f"{name}: {len(model.feature_names_in_)} features, "
              f"{len(model.classes_)} classes, first classes: {list(model.classes_[:3])}")

        if MODEL_CONFIGS[name]["encode_labels"]:
            # classes_ on this model is 0..n-1, so the encoder is saved in the same
            # file to map predictions back to disease names.
            # Pickles can break across library versions; xgboost is pinned in requirements.txt.
            joblib.dump({"model": model, "label_encoder": le}, model_dir / f"{name}_model.pkl")
        else:
            joblib.dump(model, model_dir / f"{name}_model.pkl")

    print(f"Saved models to {model_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate and optionally save the symptom models")
    parser.add_argument("--save", action="store_true",
                        help="fit each model on all data and save it (overwrites existing models)")
    args = parser.parse_args()

    print(f"Dataset: {len(clean)} rows ({before - len(clean)} duplicates dropped), "
          f"{x.shape[1]} features, {y.nunique()} classes, {counts.min()}-{counts.max()} rows per class")
    evaluate_models()

    if args.save:
        fit_and_save()
