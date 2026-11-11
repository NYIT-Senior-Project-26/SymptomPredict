import pandas as pd
from ml_layer.config import DATASET_PATH, LABEL
from shared import normalize_symptom_name

def load_dataset(dedupe: bool = True) -> tuple[pd.DataFrame, pd.Series]:
    df = pd.read_csv(DATASET_PATH)

    # The label column is cleaned separately: disease names keep their internal
    # spaces ("urinary tract infection") so they stay readable in the app
    df = df.rename(columns=lambda c: c.strip().lower())
    df.columns = [c if c == LABEL else normalize_symptom_name(c) for c in df.columns]
    df[LABEL] = df[LABEL].str.strip().str.lower()

    if dedupe:
        df = df.drop_duplicates().reset_index(drop=True)

    # Cheap sanity checks: fail loudly at load time instead of training on bad data
    assert df.columns.is_unique, "two columns normalized to the same symptom name"
    assert not df.isna().any().any(), "dataset has missing values"
    features = df.drop(columns=[LABEL])
    assert features.isin([0, 1]).all().all(), "symptom columns must be 0/1"

    return features, df[LABEL]
