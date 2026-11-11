import joblib
import lightgbm
import numpy as np
import pandas as pd
from pathlib import Path
from functools import lru_cache
from ml_layer.config import LGBM_PARAMS, MODEL_PATH
from shared import ConditionScore, Symptom, normalize_symptom_name

def make_lgbm() -> lightgbm.LGBMClassifier:
    # Create a new, unfitted LGBM model with project settings from config
    return lightgbm.LGBMClassifier(**LGBM_PARAMS)

@lru_cache(maxsize=1)
def load_model(path: Path = MODEL_PATH) -> lightgbm.LGBMClassifier:
    if not path.exists():
        raise FileNotFoundError(
            f"No trained model at {path}. From backend/, run: python -m ml_layer.train_model"
        )
    return joblib.load(path)

def build_symptom_row(symptoms: list[Symptom] | list[str], columns) -> pd.DataFrame:
    row = pd.DataFrame(0, index=[0], columns=columns)
    for symptom in symptoms:
        name = symptom.name if isinstance(symptom, Symptom) else normalize_symptom_name(symptom)
        if name not in row.columns:
            raise ValueError(f"Unknown symptom {name!r}: not a column in the dataset")
        row.loc[0, name] = 1
    return row

def top_k_predictions(
    symptoms: list[Symptom] | list[str],
    k: int = 5,
    model: lightgbm.LGBMClassifier | None = None,
) -> list[ConditionScore]:
    if not symptoms:
        # An all-zero row still produces a ranking, but it means nothing
        raise ValueError("At least one symptom is required")
    model = model if model is not None else load_model()

    row = build_symptom_row(symptoms, model.feature_names_in_)
    probs = model.predict_proba(row)[0]
    best_first = np.argsort(probs)[::-1][:k]  # indexes sorted by probability, high to low
    return [ConditionScore(name=str(model.classes_[i]), probability=float(probs[i])) for i in best_first]
