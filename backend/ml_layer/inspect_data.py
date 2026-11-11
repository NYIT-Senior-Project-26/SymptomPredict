import pandas as pd
from ml_layer.config import DATASET_PATH, LABEL
from ml_layer.data import load_dataset

def main() -> None:
    raw = pd.read_csv(DATASET_PATH)
    print("===== RAW FILE =====")
    print(f"shape: {raw.shape}")
    print(f"missing values: {raw.isna().sum().sum()}")
    print(f"duplicate rows: {raw.duplicated().sum()} of {len(raw)}")

    # Column names in the CSV that normalization changes (typos, stray spaces)
    x, y = load_dataset()
    raw_names = [c for c in raw.columns if c.strip().lower() != LABEL]
    changed = [(r, n) for r, n in zip(raw_names, x.columns) if r != n]
    print(f"\n===== COLUMN NAMES CHANGED BY NORMALIZATION ({len(changed)}) =====")
    for raw_name, clean_name in changed:
        print(f"  {raw_name!r:30} -> {clean_name!r}")

    print("\n===== CLEANED (deduplicated) =====")
    print(f"{len(x)} rows, {x.shape[1]} symptoms, {y.nunique()} diseases")

    counts = y.value_counts()
    # The smallest class caps cross-validation: 5 rows per disease -> at most 5 folds
    print(f"rows per disease: min {counts.min()}, max {counts.max()}")
    print(counts.to_string())

    sizes = x.sum(axis=1)
    print(f"\nsymptoms per row: min {sizes.min()}, median {int(sizes.median())}, max {sizes.max()}")


if __name__ == "__main__":
    main()
