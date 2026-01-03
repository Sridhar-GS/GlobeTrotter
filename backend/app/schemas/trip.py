from datetime import date

from pydantic import BaseModel, Field


class TripCreate(BaseModel):
    name: str = Field(min_length=1)
    start_date: date
    end_date: date
    description: str | None = None
    cover_photo_url: str | None = None
    budget: float | None = None


class TripUpdate(BaseModel):
    name: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    description: str | None = None
    cover_photo_url: str | None = None
    budget: float | None = None


class TripListItem(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str
    start_date: date
    end_date: date
    destination_count: int = 0
    budget: float | None = None


class TripResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str
    start_date: date
    end_date: date
    description: str | None = None
    cover_photo_url: str | None = None
    budget: float | None = None
