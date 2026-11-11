"""Model output type, shared by the ML layer, the LLM step and (later) the API."""

from pydantic import Field, computed_field

from shared.base import SharedModel


class ConditionScore(SharedModel):
    """One ranked condition from the ML model, e.g. fungal infection at 0.9988."""

    name: str = Field(min_length=1)  # disease label from the dataset, lowercase
    probability: float = Field(ge=0, le=1)

    @computed_field  # included in model_dump() and JSON, never accepted as input
    @property
    def match_score(self) -> int:
        """Probability as a 0-100 integer: the number the results screen shows
        (app/schemas/triage.py ConditionMatch.match_score) and the LLM is given."""
        return round(self.probability * 100)
