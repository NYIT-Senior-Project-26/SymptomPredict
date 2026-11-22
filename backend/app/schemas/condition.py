"""Condition detail (Figma 3.6a / 3.6b): MedlinePlus text sorted into sections by Claude."""

from pydantic import BaseModel, ConfigDict, Field


class ConditionDetailRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200, examples=["Strep throat"])
    # What the person reported, to mark matching symptoms ("You" in Figma)
    reported: list[str] = Field(default_factory=list, max_length=60)
    # From the profile, to flag treatments they're allergic to. Never stored.
    allergies: list[str] = Field(default_factory=list, max_length=30)


# Claude's structured output needs extra="forbid" on every object. Sections the
# source doesn't cover come back empty ("" or []) and the app hides them.
class _Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class SymptomItem(_Strict):
    label: str
    reported: bool  # the person reported this


class Stat(_Strict):
    value: str  # e.g. "20–30%"
    label: str  # e.g. "of sore throats in children"


class Test(_Strict):
    name: str
    timing: str  # e.g. "~10 min"; "" if the source doesn't say
    description: str


class TimelineStep(_Strict):
    when: str
    what: str


class ConditionDetail(_Strict):
    # Condition details tab
    overview: str
    symptoms: list[SymptomItem]
    symptoms_note: str
    how_common: list[Stat]
    how_common_note: str
    risk_factors: list[str]
    tests: list[Test]
    # Treatment options tab
    treatment: str
    treatment_points: list[str]
    allergy_warning: str
    at_home_care: list[str]
    timeline: list[TimelineStep]
    timeline_note: str
    get_help: list[str]


class ConditionDetailResponse(ConditionDetail):
    # The MedlinePlus topic used; may be broader than the condition (e.g. "Streptococcal Infections")
    source_title: str
    source_url: str
