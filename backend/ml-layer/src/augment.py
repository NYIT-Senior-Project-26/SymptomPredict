"""Symptom-dropout augmentation: teach the model what PARTIAL input looks like.

The problem: every row in dataset.csv is a disease's (near-)complete symptom
profile, so models only ever see full profiles in training. Real users report
1-3 symptoms. A 3-symptom row looks like nothing the model has seen, so it
guesses with confidence it hasn't earned (LightGBM put 0.9999 on one disease).

The fix: alongside each original row, add copies that keep only a random
subset of its symptoms, labeled with the same disease. The model then learns:
  - which few symptoms still point clearly at one disease, and
  - which few symptoms are genuinely ambiguous (e.g. "high_fever" alone fits
    12 diseases, so copies with only that symptom carry 12 different labels).

Measured on held-out rows (5-fold CV, see compare_models.py), LightGBM top-5
accuracy went from ~0.55 to ~0.78 with 1 symptom, and log loss roughly halved.

RULE: only ever augment TRAINING data. Augmenting before a train/test split puts
copies of test rows into training, which inflates every score (the same leak as
skipping drop_duplicates).
"""

import numpy as np
import pandas as pd


def augment_with_dropout(x, y, copies: int = 10, seed: int = 42):
    """Return (x_aug, y_aug): the original rows plus `copies` symptom-dropout copies.

    Args:
        x: binary symptom matrix, as a DataFrame (training) or numpy array (CV loops).
        y: labels, as a Series or array; any label type (strings or encoded ints).
        copies: how many dropout versions to make of every row. 10 turns ~300
            rows into ~3,300, which still trains LightGBM in about a second.
        seed: fixes the random choices so retraining gives the same model.

    Returns the same types that came in. A DataFrame keeps its column names, which
    matters: the saved model's feature_names_in_ is how llm.py builds a symptom row.
    """
    # Work on plain numpy arrays internally; convert back at the end
    is_frame = isinstance(x, pd.DataFrame)
    values = x.to_numpy() if is_frame else np.asarray(x)
    labels = y.to_numpy() if isinstance(y, pd.Series) else np.asarray(y)

    rng = np.random.default_rng(seed)
    augmented = [values]  # keep the originals: a full profile is still valid input

    for _ in range(copies):
        dropped = np.zeros_like(values)
        for i, row in enumerate(values):
            present = np.flatnonzero(row)  # column indexes where the symptom is 1
            if len(present) == 0:
                continue  # nothing to drop; leaves an all-zero row (none in this dataset)

            # How many symptoms this copy keeps: uniform from 1 to all of them.
            # Uniform means "user reported 1 symptom" is as common as "user
            # reported all 11", so short inputs get plenty of training examples.
            n_keep = rng.integers(1, len(present) + 1)  # upper bound is exclusive

            # Which ones: a random subset, no repeats
            keep = rng.choice(present, size=n_keep, replace=False)
            dropped[i, keep] = 1
        augmented.append(dropped)

    # Stack originals + copies. Labels repeat in the same block order, so row i of
    # every block still lines up with labels[i].
    x_out = np.vstack(augmented)
    y_out = np.tile(labels, copies + 1)

    # NOTE: no drop_duplicates here, on purpose. Short copies collide across
    # diseases (e.g. "itching" alone), and keeping every copy is what tells the
    # model how often each disease explains that symptom.

    if is_frame:
        x_out = pd.DataFrame(x_out, columns=x.columns)
        name = y.name if isinstance(y, pd.Series) else None
        y_out = pd.Series(y_out, name=name)
    return x_out, y_out
