from datetime import date

from pydantic import BaseModel

from app.schemas.stop import StopResponse
from app.schemas.trip import TripResponse


class ShareResponse(BaseModel):
    share_id: str
    public_url: str


class PublicTripResponse(BaseModel):
    trip: TripResponse
    stops: list[StopResponse]


class CopyTripResponse(BaseModel):
    new_trip_id: int
