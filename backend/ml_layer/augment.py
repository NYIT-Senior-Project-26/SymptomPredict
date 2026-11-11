import numpy as np
import pandas as pd
from ml_layer.config import AUGMENT_COPIES, SEED

def augment_with_dropout(x, y, copies: int = AUGMENT_COPIES, seed: int = SEED):
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
