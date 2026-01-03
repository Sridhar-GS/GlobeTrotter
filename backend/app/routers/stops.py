from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.city import City
from app.models.stop import Stop
from app.models.user import User
from app.schemas.stop import StopCreate, StopResponse, StopUpdate
from app.services.trip_service import get_trip_for_user
from app.utils.response_utils import to_float

router = APIRouter(tags=["stops"])


@router.get("/trips/{trip_id}/stops", response_model=list[StopResponse])
def list_stops(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_trip_for_user(db, current_user.id, trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    stops = (
        db.query(Stop).filter(Stop.trip_id == trip.id).order_by(Stop.order_index.asc(), Stop.start_date.asc()).all()
    )

    result: list[StopResponse] = []
    for s in stops:
        city = db.get(City, s.city_id)
        result.append(
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
    return result


@router.post("/trips/{trip_id}/stops", response_model=StopResponse)
def create_stop(
    trip_id: int,
    payload: StopCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = get_trip_for_user(db, current_user.id, trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    order_index = payload.order_index
    if order_index is None:
        order_index = (
            db.query(Stop).filter(Stop.trip_id == trip.id).count()
        )

    stop = Stop(
        trip_id=trip.id,
        city_id=payload.city_id,
        start_date=payload.start_date,
        end_date=payload.end_date,
        order_index=order_index,
        stay_cost=payload.stay_cost,
        transport_cost=payload.transport_cost,
        meals_cost=payload.meals_cost,
    )
    db.add(stop)
    db.commit()
    db.refresh(stop)

    city = db.get(City, stop.city_id)
    return StopResponse(
        id=stop.id,
        trip_id=stop.trip_id,
        city_id=stop.city_id,
        start_date=stop.start_date,
        end_date=stop.end_date,
        order_index=stop.order_index,
        stay_cost=to_float(stop.stay_cost),
        transport_cost=to_float(stop.transport_cost),
        meals_cost=to_float(stop.meals_cost),
        city_name=city.name if city else None,
        city_country=city.country if city else None,
    )


@router.patch("/stops/{stop_id}", response_model=StopResponse)
def update_stop(
    stop_id: int,
    payload: StopUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stop = db.get(Stop, stop_id)
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    trip = get_trip_for_user(db, current_user.id, stop.trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(stop, field, value)

    db.add(stop)
    db.commit()
    db.refresh(stop)

    city = db.get(City, stop.city_id)
    return StopResponse(
        id=stop.id,
        trip_id=stop.trip_id,
        city_id=stop.city_id,
        start_date=stop.start_date,
        end_date=stop.end_date,
        order_index=stop.order_index,
        stay_cost=to_float(stop.stay_cost),
        transport_cost=to_float(stop.transport_cost),
        meals_cost=to_float(stop.meals_cost),
        city_name=city.name if city else None,
        city_country=city.country if city else None,
    )


@router.delete("/stops/{stop_id}")
def delete_stop(stop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.get(Stop, stop_id)
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    trip = get_trip_for_user(db, current_user.id, stop.trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    db.delete(stop)
    db.commit()
    return {"deleted": True}
