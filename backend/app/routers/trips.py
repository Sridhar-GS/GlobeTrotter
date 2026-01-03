from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.trip import Trip
from app.models.user import User
from app.schemas.trip import TripCreate, TripListItem, TripResponse, TripUpdate
from app.services.trip_service import delete_trip_for_user, get_trip_for_user, list_trips_for_user

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("", response_model=list[TripListItem])
def list_trips(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rows = list_trips_for_user(db, current_user.id)
    result: list[TripListItem] = []
    for trip, count in rows:
        result.append(
            TripListItem(
                id=trip.id,
                name=trip.name,
                start_date=trip.start_date,
                end_date=trip.end_date,
                destination_count=int(count or 0),
                budget=float(trip.budget) if trip.budget is not None else None,
            )
        )
    return result


@router.post("", response_model=TripResponse)
def create_trip(payload: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = Trip(user_id=current_user.id, **payload.model_dump())
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_trip_for_user(db, current_user.id, trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return trip


@router.patch("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    payload: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = get_trip_for_user(db, current_user.id, trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(trip, field, value)

    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ok = delete_trip_for_user(db, current_user.id, trip_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return {"deleted": True}
