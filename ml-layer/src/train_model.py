import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier

# Specifically used to just train the model off of the symbipredict-2022 dataset
# Data set link:
# https://www.kaggle.com/datasets/manvivemula/symbipredict-2022

# Load up dataset
# Set dataset path
root_dir = Path(__file__).resolve().parent
dataset_path = root_dir.parent / "data" / "dataset.csv"
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

# Cross validation
# 5 splits is the default. add 'n_splits=x" if changes are desired
cv = StratifiedKFold(shuffle=True, random_state=42)
rf_model = RandomForestClassifier(random_state=42)

# Model eval
scores = cross_val_score(rf_model, x, y, cv=cv)

# Fit onto data; analyze output
rf_model.fit(x,y)

# Save model to joblib save file
joblib.dump(rf_model, "ml-layer/models/rf_model.pkl")