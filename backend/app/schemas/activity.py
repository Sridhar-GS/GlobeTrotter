from datetime import datetime

from pydantic import BaseModel


class ActivityCreate(BaseModel):
    name: str
    type: str | None = None
    start_time: datetime | None = None
    duration_minutes: int | None = None
    cost: float = 0
    notes: str | None = None


class ActivityUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    start_time: datetime | None = None
    duration_minutes: int | None = None
    cost: float | None = None
    notes: str | None = None


class ActivityResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    stop_id: int
    name: str
    type: str | None = None
    start_time: datetime | None = None
    duration_minutes: int | None = None
    cost: float
    notes: str | None = None


class ActivitySuggestion(BaseModel):
    name: str
    type: str | None = None
    typical_cost: float | None = None
    typical_duration_minutes: int | None = None
