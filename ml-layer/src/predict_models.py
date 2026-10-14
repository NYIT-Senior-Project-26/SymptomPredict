import pandas as pd
import numpy as np
import joblib

rf_model = joblib.load('ml-layer/models/rf_model.pkl')

# This is the random forest testing mode
def print_top_k_prediction_rf(row: pd.DataFrame, k: int, model=rf_model) -> dict:
    # This will mainly be used for testing purposes, LightGBM / XGBoost is planned for prod.
    # The general structure / layout should remain the same for the final model
    return_dict = {}

    # Get classes from model
    mod_classes = model.classes_

    # Get probabilities and flatten array
    probs = model.predict_proba(row)[0]
    # flat_probs = probs.flatten()
    # flat_probs = model.predict_proba(row).flatten()

    # Get top k indicies
    top_inds = np.argsort(probs, descending=True)
    top_k_inds = top_inds[:k]

    for i, ind in enumerate(top_k_inds):
        print(f"Prediction {i+1}: {mod_classes[ind]} - {probs[ind]}")
        return_dict.update({mod_classes[ind]: float(probs[ind])})

    print(f"Return Dict: {return_dict}")
    return return_dict