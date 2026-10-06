"""Local ML model: a fast first-pass ranking of likely conditions.

Train a scikit-learn classifier (symptoms -> condition) and save it to
models/symptom_model.joblib as {"model": clf, "vocab": [symptom, ...]}.
Until a model exists, predict() returns an empty list and Claude does the work alone.
"""

from pathlib import Path

import joblib
import numpy as np

MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "symptom_model.joblib"


class SymptomModel:
    def __init__(self, path: Path = MODEL_PATH):
        self._model = None
        self._vocab: list[str] = []
        if path.exists():
            bundle = joblib.load(path)
            self._model = bundle["model"]
            self._vocab = bundle["vocab"]

    @property
    def loaded(self) -> bool:
        return self._model is not None

    def predict(self, symptoms: list[str], top_k: int = 5) -> list[tuple[str, float]]:
        if not self.loaded:
            return []
        wanted = {s.strip().lower() for s in symptoms}
        x = np.array([[1 if v in wanted else 0 for v in self._vocab]])
        probs = self._model.predict_proba(x)[0]
        ranked = sorted(zip(self._model.classes_, probs), key=lambda p: p[1], reverse=True)
        return [(str(c), float(p)) for c, p in ranked[:top_k]]


symptom_model = SymptomModel()
