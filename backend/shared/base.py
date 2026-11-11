from typing import Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints

class SharedModel(BaseModel):
    model_config = ConfigDict(
        # Re-run validation when a field is assigned after creation
        validate_assignment=True,
        # Reject unknown keys instead of silently dropping them
        extra="forbid",
        # Use .model_dump(mode="json") plain strings are needed
    )

# Replaces _clean_name() from llm.py
NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]