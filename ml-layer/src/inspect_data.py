import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier

# Data set link:
# https://www.kaggle.com/datasets/manvivemula/symbipredict-2022

# Load up dataset
# Set dataset path
root_dir = Path(__file__).resolve().parent
dataset_path = root_dir.parent / "data" / "dataset.csv"
raw = pd.read_csv(dataset_path)

# This is the target column in the CSV
LABEL = "prognosis"

# Dataset traversal
print("===== DATASET SHAPE =====")
print(raw.shape)

print("\n===== DATA TYPES =====")
print(raw.dtypes.value_counts())

print("\n===== MISSING VALUES =====")
print(raw.isna().sum().sum())

print("\n===== DISTINCT VALUES IN FEATURE COLUMNS =====")
features = raw.drop(columns=[LABEL])
print(sorted(pd.unique(features.values.ravel())))

print("\n===== CLASS VALUES =====")
print(raw.duplicated().sum(), "of", len(raw))

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
print(f"\n=== DEDUPE: {before} -> {len(clean)} rows ===")

print("\n=== CLASS BALANCE AFTER DEDUPE ===")
counts = clean[LABEL].value_counts()
print(counts)
print("smallest class:", counts.min())  # this limits how you can split (see below)

# Verification
assert clean.isna().sum().sum() == 0
assert set(pd.unique(clean.drop(columns=[LABEL]).values.ravel())) <= {0, 1}
assert all(c == clean_name(c) for c in clean.columns)
print("\nAll checks passed.")

# Split features / label
# Drop LABEL column; drop a single column
x = clean.drop(columns=[LABEL])
y = clean[LABEL]

print(x.shape, y.shape)

# Cross validation
# 5 splits is the default. add 'n_splits=x" if changes are desired
cv = StratifiedKFold(shuffle=True, random_state=42)
rf_model = RandomForestClassifier(random_state=42)

# Model eval
scores = cross_val_score(rf_model, x, y, cv=cv)

print(f"Model Eval Scores: {scores}")
print(f"== Mean: {scores.mean()}")
print(f"== Std Deviation: {scores.std()}")

# Fit onto data; analyze output
rf_model.fit(x,y)

x_one_row = x.iloc[[0]]

probabilities = rf_model.predict_proba(x_one_row)
print(probabilities)
print(probabilities.flatten())

# Obtain RF model classes
#   Returns disease names in the same order of the disease prediction
model_classes = rf_model.classes_
probs_y = probabilities.flatten()
top_indices = np.argsort(probs_y, descending=True)

# Return the diseases and their probabilities
top_k_inds = top_indices[:3]
"""
top_k_class = model_classes[]

print("\nTop 3 most likely:")
for ind, dis in zip(top_k_inds, top_k_class):
    print(ind, dis)
"""