from pathlib import Path

ML_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ML_DIR.parent

DATASET_PATH = ML_DIR / "data" / "dataset.csv"
RESULTS_DIR = ML_DIR / "results"

# Saved models live in backend/models/
MODEL_DIR = BACKEND_DIR / "models"
MODEL_PATH = MODEL_DIR / "lgbm_model.pkl"

# Target column in dataset
LABEL = "prognosis"

# One seed for every random choice
SEED = 42

# LightGBM settings for this dataset
LGBM_PARAMS = {
    "random_state": SEED,
    "num_leaves": 8,
    "min_child_samples": 2,
    "min_data_in_bin": 1,
    "min_sum_hessian_in_leaf": 0,
    "colsample_bytree": 0.5,
    "subsample": 0.8,
    "subsample_freq": 1,
    "verbose": -1,
}

AUGMENT_COPIES = 10
