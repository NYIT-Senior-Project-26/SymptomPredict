from datetime import date
from enum import Enum
from typing import Annotated
from pydantic import Field, StrictInt, field_validator, model_validator
from shared.base import NonEmptyStr, SharedModel

class Sex(str, Enum):
    MALE = "male"
    FEMALE = "female"

class BloodPressure(str, Enum):
    HIGH = "high"
    NORMAL = "normal"
    LOW = "low"
    NOT_SURE = "not sure"

class SmokingStatus(str, Enum):
    NEVER = "never"
    FORMER = "former"
    CURRENT = "current"

class DosageUnit(str, Enum):
    MG = "mg"
    MCG = "mcg"
    G = "g"
    ML = "mL"
    IU = "IU"
    UNITS = "units"
    PUFFS = "puffs"
    DROPS = "drops"
    TABLETS = "tablets"

class Frequency(str, Enum):
    ONCE_DAILY = "once daily"
    TWICE_DAILY = "twice daily"
    THREE_TIMES_DAILY = "three times daily"
    FOUR_TIMES_DAILY = "four times daily"
    EVERY_OTHER_DAY = "every other day"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    AS_NEEDED = "as needed"

class Route(str, Enum):
    ORAL = "oral"
    SUBLINGUAL = "sublingual"
    TOPICAL = "topical"
    TRANSDERMAL = "transdermal"
    INHALED = "inhaled"
    NASAL = "nasal"
    OPHTHALMIC = "ophthalmic"
    INJECTION = "injection"
    OTHER = "other"

class AllergyCategory(str, Enum):
    MEDICATION = "medication"
    FOOD = "food"
    ENVIRONMENTAL = "environmental"
    INSECT = "insect"
    LATEX = "latex"
    OTHER = "other"

class AllergySeverity(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    UNKNOWN = "unknown"

class ConditionStatus(str, Enum):
    ACTIVE = "active"
    MANAGED = "managed"
    IN_REMISSION = "in remission"
    NOT_SURE = "not sure"

# Models

class Medication(SharedModel):
    name: NonEmptyStr
    frequency: Frequency
    dosage: Annotated[float, Field(gt=0)] | None = None
    unit: DosageUnit | None = None
    route: Route = Route.ORAL
    prescribed: bool = True # False for OTC / supplements

    @field_validator("dosage", mode="before")
    @classmethod
    def reject_bool_dosage(cls, value):
        if isinstance(value, bool):
            raise ValueError("dosage must be a number, not a boolean")
        return value

    @model_validator(mode="after")
    def dosage_and_unit_together(self) -> "Medication":
        if (self.dosage is None) != (self.unit is None):
            raise ValueError("dosage and unit must either both be provided or both be omitted")
        return self

    def __str__(self) -> str:
        dose = f" {self.dosage:g} {self.unit.value}" if self.dosage is not None else " (dose unknown)"
        source = "prescribed" if self.prescribed else "OTC"
        return f"{self.name}{dose}, {self.route.value}, {self.frequency.value} ({source})"


class Allergy(SharedModel):
    allergen: NonEmptyStr
    category: AllergyCategory
    severity: AllergySeverity = AllergySeverity.UNKNOWN
    reaction: NonEmptyStr | None = None

    # e.g. "Penicillin (medication) - severe: hives"
    def __str__(self) -> str:
        reaction = f": {self.reaction}" if self.reaction else ""
        return f"{self.allergen} ({self.category.value}) - {self.severity.value}{reaction}"


class ExistingCondition(SharedModel):
    name: NonEmptyStr
    status: ConditionStatus = ConditionStatus.NOT_SURE
    diagnosed: bool = True  # False if self-suspected, not confirmed by a clinician
    year_diagnosed: StrictInt | None = None

    @field_validator("year_diagnosed")
    @classmethod
    def year_not_in_future(cls, value: int | None) -> int | None:
        if value is None:
            return value
        current_year = date.today().year
        if not (1900 <= value <= current_year):
            raise ValueError(f"year_diagnosed must be within 1900 and {current_year}, got {value}")
        return value

    # e.g. "Type 2 diabetes - managed, diagnosed 2019"
    def __str__(self) -> str:
        if self.diagnosed:
            since = f", diagnosed {self.year_diagnosed}" if self.year_diagnosed else ", diagnosed"
        else:
            since = ", not formally diagnosed"
        return f"{self.name} - {self.status.value}{since}"


class Demographic(SharedModel):
    # Keeps the 5 to 80 range, subject to change
    age: StrictInt = Field(ge=5, le=80)
    sex: Sex
    weight: float = Field(ge=35, le=350) # Weight is recorded in pounds
    blood_pressure: BloodPressure
    smoking_status: SmokingStatus
    medications: list[Medication] = Field(default_factory=list)
    allergies: list[Allergy] = Field(default_factory=list)
    conditions: list[ExistingCondition] = Field(default_factory=list)

    @field_validator("weight", mode="before")
    @classmethod
    def reject_bool_weight(cls, value):
        if isinstance(value, bool):
            raise ValueError("weight must be a number, not a boolean")
        return value