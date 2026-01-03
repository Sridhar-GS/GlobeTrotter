from datetime import date

from pydantic import BaseModel


class StopCreate(BaseModel):
    city_id: int
    start_date: date
    end_date: date
    order_index: int | None = None

    stay_cost: float = 0
    transport_cost: float = 0
    meals_cost: float = 0


class StopUpdate(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    order_index: int | None = None

    stay_cost: float | None = None
    transport_cost: float | None = None
    meals_cost: float | None = None


class StopResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    trip_id: int
    city_id: int
    start_date: date
    end_date: date
    order_index: int

    stay_cost: float
    transport_cost: float
    meals_cost: float

    city_name: str | None = None
    city_country: str | None = None
