import re
from pydantic import Field, StrictInt, field_validator
from shared.base import SharedModel

# One or more whitespace characters and/or underscores, in any mix.
_SEPARATORS = re.compile(r"[\s_]+")

def normalize_symptom_name(name: str) -> str:
    # Keeps mapping to cannonical name
    # Ex: 'Skin Rash' becomes 'skin_rash'
    return _SEPARATORS.sub("_", name.strip().lower()).strip("_")

class Symptom(SharedModel):
    name: str = Field(min_length=1)
    severity: StrictInt = Field(ge=1, le=10)  # 1 = least severe, 10 = worst
    # Duration basic code, need to figure out how this would be implemented
    # duration_days: int | None = Field(default=None, ge=0)

    @field_validator("name")
    @classmethod
    def normalize(cls, value: str) -> str:
        cleaned = normalize_symptom_name(value)
        if not cleaned:
            raise ValueError("symptom name cannot be empty")
        return cleaned