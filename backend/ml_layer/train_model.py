import joblib
from sklearn.model_selection import StratifiedKFold, cross_val_score
from ml_layer.augment import augment_with_dropout
from ml_layer.config import MODEL_DIR, MODEL_PATH, SEED
from ml_layer.data import load_dataset
from ml_layer.model import make_lgbm

def main() -> None:
    x, y = load_dataset()
    counts = y.value_counts()
    print(
        f"Dataset: {len(x)} unique rows, {x.shape[1]} symptoms, {y.nunique()} diseases, "
        f"{counts.min()}-{counts.max()} rows per disease"
    )

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    scores = cross_val_score(make_lgbm(), x, y, cv=cv)
    print(f"CV accuracy (full profiles): mean={scores.mean():.3f} std={scores.std():.3f}")

    x_aug, y_aug = augment_with_dropout(x, y)
    model = make_lgbm().fit(x_aug, y_aug)
    print(f"Final fit on {len(x_aug)} rows ({len(x)} originals + dropout copies)")

    # A plain LGBMClassifier, so model.py loads it with nothing but joblib
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")

# Only runs when executed directly, not when imported (e.g. by tests)
if __name__ == "__main__":
    main()
