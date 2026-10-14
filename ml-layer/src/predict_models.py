import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# This is the random forest testing mode
def print_top_k_prediction_rf(model: RandomForestClassifier, row: pd.DataFrame, k: int) -> dict:
    # This will mainly be used for testing purposes, LightGBM / XGBoost is planned for prod.
    # The general structure / layout should remain the same for the final model
    return_dict = {}

    # Get classes from model
    mod_classes = model.classes_

    # Get probabilities and flatten array
    probs = model.predict_proba(row)
    probs.flatten()

    # Get top k indicies
    top_inds = np.argsort(probs, descending=True)
    top_k_inds = top_inds[:k]

    for i, ind in enumerate(top_k_inds):
        print(f"Prediction {i+1}: {mod_classes[ind]} - {probs[ind]}")
        return_dict.update({int(probs[ind]): mod_classes[ind]})

    print(f"Return Dict: {return_dict}")
    return return_dict