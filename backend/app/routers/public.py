from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.city import City
from app.models.user import User
from app.schemas.shared import CopyTripResponse, PublicTripResponse, ShareResponse
from app.schemas.stop import StopResponse
from app.schemas.trip import TripResponse
from app.services.share_service import get_or_create_share, get_public_trip_by_share_id
from app.services.trip_service import copy_trip, get_trip_for_user
from app.utils.response_utils import to_float

router = APIRouter(tags=["public"])


@router.post("/share/trips/{trip_id}", response_model=ShareResponse)
def share_trip(trip_id: int, request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_trip_for_user(db, current_user.id, trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    share = get_or_create_share(db, trip)
    base = str(request.base_url).rstrip("/")
    public_url = f"{base}/api/public/{share.share_id}"
    return ShareResponse(share_id=share.share_id, public_url=public_url)


@router.get("/public/{share_id}", response_model=PublicTripResponse)
def get_public(share_id: str, db: Session = Depends(get_db)):
    trip = get_public_trip_by_share_id(db, share_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    trip_response = TripResponse.model_validate(trip)

    stops: list[StopResponse] = []
    for s in trip.stops:
        city = db.get(City, s.city_id)
        stops.append(
            StopResponse(
                id=s.id,
                trip_id=s.trip_id,
                city_id=s.city_id,
                start_date=s.start_date,
                end_date=s.end_date,
                order_index=s.order_index,
                stay_cost=to_float(s.stay_cost),
                transport_cost=to_float(s.transport_cost),
                meals_cost=to_float(s.meals_cost),
                city_name=city.name if city else None,
                city_country=city.country if city else None,
            )
        )

    return PublicTripResponse(trip=trip_response, stops=stops)


@router.post("/public/{share_id}/copy", response_model=CopyTripResponse)
def copy_public_trip(share_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_public_trip_by_share_id(db, share_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    new_trip = copy_trip(db, source_trip=trip, new_user_id=current_user.id)
    return CopyTripResponse(new_trip_id=new_trip.id)
