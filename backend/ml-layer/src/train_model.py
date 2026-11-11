import pandas as pd
import xgboost as xgb
import joblib
import lightgbm
from pathlib import Path
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from augment import augment_with_dropout

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

print(f"Dataset: {len(clean)} rows ({before - len(clean)} duplicates dropped), "
      f"{x.shape[1]} features, {y.nunique()} classes, {counts.min()}-{counts.max()} rows per class")

# Cross validation
# 5 splits is the default. add 'n_splits=x" if changes are desired
# cross_val_score clones and refits the model on each fold, so no fit is needed beforehand
cv = StratifiedKFold(shuffle=True, random_state=42)

model_dir.mkdir(parents=True, exist_ok=True)

# Random forest
rf_model = RandomForestClassifier(random_state=42)

# Model eval
rf_scores = cross_val_score(rf_model, x, y, cv=cv)
print(f"   rf: mean={rf_scores.mean():.3f} std={rf_scores.std():.3f}")

# Fit onto data; save model
rf_model.fit(x, y)
joblib.dump(rf_model, model_dir / "rf_model.pkl")

# XGBoost
# XGBoost (3.x) rejects string labels, so it trains on integers 0..n-1.
# The encoder's classes_ is the mapping back to disease names and is saved with the model.
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# The dataset is tiny (304 rows, 41 classes), so XGBoost's defaults don't fit it (~0.88 CV).
# Shallower trees plus row + column subsampling: ~0.997.
xgb_model = xgb.XGBClassifier(
    random_state=42,
    max_depth=3,
    colsample_bytree=0.5,
    subsample=0.8,
)

# Model eval
xgb_scores = cross_val_score(xgb_model, x, y_encoded, cv=cv)
print(f"  xgb: mean={xgb_scores.mean():.3f} std={xgb_scores.std():.3f}")

# Fit onto data; save model with its label encoder
# Pickles can break across library versions; xgboost is pinned in requirements.txt.
xgb_model.fit(x, y_encoded)
joblib.dump({"model": xgb_model, "label_encoder": le}, model_dir / "xgb_model.pkl")

# LightGBM
# LightGBM's defaults (min_child_samples=20, etc.) barely split on this little data (~0.69 CV).
# Smaller leaf/bin minimums plus row + column subsampling: ~0.99.
# LightGBM accepts string labels directly, so no encoder is needed.
lgbm_model = lightgbm.LGBMClassifier(
    random_state=42,
    num_leaves=8,
    min_child_samples=2,
    min_data_in_bin=1,
    min_sum_hessian_in_leaf=0,
    colsample_bytree=0.5,
    subsample=0.8,
    subsample_freq=1,    # subsample does nothing unless this is > 0
    verbose=-1,          # silence per-iteration [Info] logs
)

# Model eval
# This is the full-profile sanity check (~0.99) and is measured WITHOUT augmentation.
# It can't show augmentation's benefit; that only appears on partial-symptom input,
# which compare_models.py measures (augmenting inside each fold, never before splitting).
lgbm_scores = cross_val_score(lgbm_model, x, y, cv=cv)
print(f" lgbm: mean={lgbm_scores.mean():.3f} std={lgbm_scores.std():.3f}")

# Fit onto AUGMENTED data; save model.
# The production model trains on the originals plus symptom-dropout copies so it
# handles 1-3 symptom input (see augment.py). Safe to use all rows here: this is the
# final fit, not an evaluation, so there is no test set to leak into.
# The result is still a plain LGBMClassifier, so llm.py / predict_models.py load it unchanged.
x_aug, y_aug = augment_with_dropout(x, y)
print(f"       final fit on {len(x_aug)} rows ({len(x)} originals + dropout copies)")
lgbm_model.fit(x_aug, y_aug)
joblib.dump(lgbm_model, model_dir / "lgbm_model.pkl")

print(f"Saved models to {model_dir}")
