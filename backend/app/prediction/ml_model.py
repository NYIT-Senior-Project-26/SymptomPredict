"""First-pass ranking of likely conditions from the LightGBM model in ml_layer/.

Train it once per machine, from backend/:  python -m ml_layer.train_model
Until the model file exists, rank() returns no candidates and Claude does the work alone.
"""

import logging
from dataclasses import dataclass, field

from app.prediction.symptom_map import match_symptoms
from shared import ConditionScore

logger = logging.getLogger(__name__)


@dataclass
class Ranking:
    available: bool = False  # False when the model isn't trained or can't load
    candidates: list[ConditionScore] = field(default_factory=list)
    used: list[str] = field(default_factory=list)  # dataset symptoms the ranking is based on
    matched: list[str] = field(default_factory=list)  # reported symptoms the model could use
    unmatched: list[str] = field(default_factory=list)  # reported symptoms the model never saw


def _load():
    try:
        from ml_layer.model import load_model

        return load_model()
    except (ImportError, FileNotFoundError) as e:
        # Only the reason is logged, never the symptoms (see BUILD_STATUS.md: no health data in logs)
        logger.warning("ML model unavailable, Claude will analyze alone: %s", e)
        return None


def rank(symptoms: list[str], follow_up_answers: dict[str, list[str]], top_k: int = 5) -> Ranking:
    model = _load()
    if model is None:
        return Ranking(unmatched=[s.strip() for s in symptoms if s.strip()])

    from ml_layer.model import top_k_predictions

    m = match_symptoms(symptoms, follow_up_answers, set(model.feature_names_in_))
    candidates = top_k_predictions(m.keys, top_k, model=model) if m.keys else []
    return Ranking(True, candidates, m.keys, m.matched, m.unmatched)
