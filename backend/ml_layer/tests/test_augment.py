import numpy as np
import pandas as pd
import pytest
from ml_layer.augment import augment_with_dropout

@pytest.fixture
def small_data():
    """3 'diseases' with 4, 2 and 1 symptoms, as the training script passes them"""
    x = pd.DataFrame(
        [[1, 1, 1, 1, 0], [0, 0, 0, 1, 1], [0, 0, 1, 0, 0]],
        columns=["fever", "cough", "rash", "fatigue", "nausea"],
    )
    y = pd.Series(["flu", "gastro", "allergy"], name="prognosis")
    return x, y

def test_output_size_is_originals_plus_copies(small_data):
    x, y = small_data
    x_aug, y_aug = augment_with_dropout(x, y, copies=5)
    assert len(x_aug) == len(y_aug) == len(x) * 6

def test_originals_are_kept_unchanged_at_the_top(small_data):
    x, y = small_data
    x_aug, y_aug = augment_with_dropout(x, y, copies=3)
    pd.testing.assert_frame_equal(x_aug.iloc[: len(x)], x)
    assert list(y_aug.iloc[: len(y)]) == list(y)

def test_copies_only_drop_symptoms_never_add(small_data):
    # Every copy must be a subset of its source row, with the same label,
    # and keep at least one symptom.
    x, y = small_data
    copies = 20
    x_aug, y_aug = augment_with_dropout(x, y, copies=copies)
    src = x.to_numpy()
    aug = x_aug.to_numpy()
    for block in range(1, copies + 1):
        for i in range(len(x)):
            row = aug[block * len(x) + i]
            assert np.all(row <= src[i]), "a copy gained a symptom its source didn't have"
            assert row.sum() >= 1, "a copy kept zero symptoms"
            assert y_aug.iloc[block * len(x) + i] == y.iloc[i], "label got misaligned"

def test_produces_a_range_of_symptom_counts(small_data):
    # The 4-symptom row should yield copies with 1, 2, 3 and 4 symptoms, not
    # always the same count. Short inputs are the whole point.
    x, y = small_data
    x_aug, _ = augment_with_dropout(x, y, copies=50)
    flu_copies = x_aug.iloc[len(x)::len(x)]  # row 0 of every block = the flu row
    assert set(flu_copies.sum(axis=1)) == {1, 2, 3, 4}

def test_same_seed_same_output_different_seed_different_output(small_data):
    x, y = small_data
    a, _ = augment_with_dropout(x, y, copies=10, seed=1)
    b, _ = augment_with_dropout(x, y, copies=10, seed=1)
    c, _ = augment_with_dropout(x, y, copies=10, seed=2)
    pd.testing.assert_frame_equal(a, b)
    assert not a.equals(c)

def test_keeps_column_names_and_types(small_data):
    # The saved model's feature_names_in_ comes from these column names,
    # and llm.py builds its symptom row from feature_names_in_.
    x, y = small_data
    x_aug, y_aug = augment_with_dropout(x, y, copies=2)
    assert isinstance(x_aug, pd.DataFrame) and list(x_aug.columns) == list(x.columns)
    assert isinstance(y_aug, pd.Series) and y_aug.name == "prognosis"

def test_numpy_in_numpy_out(small_data):
    # compare_models.py passes numpy arrays and integer-encoded labels
    x, _ = small_data
    x_aug, y_aug = augment_with_dropout(x.to_numpy(), np.array([0, 1, 2]), copies=2)
    assert isinstance(x_aug, np.ndarray) and isinstance(y_aug, np.ndarray)
    assert list(y_aug) == [0, 1, 2] * 3