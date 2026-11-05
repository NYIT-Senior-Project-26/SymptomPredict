import pandas as pd
import numpy as np
import joblib
from pathlib import Path

model_dir = Path(__file__).resolve().parent.parent.parent / "models"

rf_model = joblib.load(model_dir / 'rf_model.pkl')
lgbm_model = joblib.load(model_dir / 'lgbm_model.pkl')

# XGBoost is trained on integer labels, so its classes_ is 0..n-1.
# The label encoder is saved in the same file to map them back to disease names.
xgb_bundle = joblib.load(model_dir / 'xgb_model.pkl')
xgb_model = xgb_bundle['model']
xgb_class_names = xgb_bundle['label_encoder'].classes_

# This is the random forest testing mode
def top_k_prediction_rf(row: pd.DataFrame, k: int, model=rf_model) -> dict:
    # This will mainly be used for testing purposes, LightGBM / XGBoost is planned for prod.
    # The general structure / layout should remain the same for the final model
    return_dict = {}

    # Get classes from model
    mod_classes = model.classes_

    # Get probabilities and flatten array
    probs = model.predict_proba(row)[0]

    # Get top k indicies
    top_inds = np.argsort(probs, descending=True)
    top_k_inds = top_inds[:k]

    for ind in top_k_inds:
        return_dict.update({mod_classes[ind]: float(probs[ind])})

    return return_dict

# XGBoost Model
def top_k_prediction_xgb(row: pd.DataFrame, k: int, model=xgb_model, class_names=xgb_class_names) -> dict:
    return_dict = {}

    # model.classes_ is just 0..n-1 here, so use the saved names instead
    if len(class_names) != len(model.classes_):
        raise ValueError(f"Got {len(class_names)} class names for a model with {len(model.classes_)} classes")

    # Get probabilities and flatten array
    probs = model.predict_proba(row)[0]

    # Get top k indicies
    top_inds = np.argsort(probs, descending=True)
    top_k_inds = top_inds[:k]

    for ind in top_k_inds:
        return_dict.update({class_names[ind]: float(probs[ind])})

    return return_dict

# LightGBM Model
def top_k_prediction_lgbm(row: pd.DataFrame, k: int, model=lgbm_model) -> dict:
    return_dict = {}

    # Get classes from model (LightGBM trains on the disease names directly)
    mod_classes = model.classes_

    # Get probabilities and flatten array
    probs = model.predict_proba(row)[0]

    # Get top k indicies
    top_inds = np.argsort(probs, descending=True)
    top_k_inds = top_inds[:k]

    for ind in top_k_inds:
        return_dict.update({mod_classes[ind]: float(probs[ind])})

    return return_dict
