from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.stop import Stop
from app.models.trip import Trip


def list_trips_for_user(db: Session, user_id: int) -> list[tuple[Trip, int]]:
    stmt = (
        select(Trip, func.count(Stop.id).label("destination_count"))
        .outerjoin(Stop, Stop.trip_id == Trip.id)
        .where(Trip.user_id == user_id)
        .group_by(Trip.id)
        .order_by(Trip.created_at.desc())
    )
    return list(db.execute(stmt).all())


def get_trip_for_user(db: Session, user_id: int, trip_id: int) -> Trip | None:
    trip = db.get(Trip, trip_id)
    if not trip or trip.user_id != user_id:
        return None
    return trip


def delete_trip_for_user(db: Session, user_id: int, trip_id: int) -> bool:
    trip = get_trip_for_user(db, user_id, trip_id)
    if not trip:
        return False
    db.delete(trip)
    db.commit()
    return True


def copy_trip(db: Session, *, source_trip: Trip, new_user_id: int) -> Trip:
    new_trip = Trip(
        user_id=new_user_id,
        name=f"Copy of {source_trip.name}",
        start_date=source_trip.start_date,
        end_date=source_trip.end_date,
        description=source_trip.description,
        cover_photo_url=source_trip.cover_photo_url,
        budget=source_trip.budget,
    )
    db.add(new_trip)
    db.flush()

    for stop in source_trip.stops:
        new_stop = Stop(
            trip_id=new_trip.id,
            city_id=stop.city_id,
            start_date=stop.start_date,
            end_date=stop.end_date,
            order_index=stop.order_index,
            stay_cost=stop.stay_cost,
            transport_cost=stop.transport_cost,
            meals_cost=stop.meals_cost,
        )
        db.add(new_stop)
        db.flush()

        for act in stop.activities:
            db.add(
                Activity(
                    stop_id=new_stop.id,
                    name=act.name,
                    type=act.type,
                    start_time=act.start_time,
                    duration_minutes=act.duration_minutes,
                    cost=act.cost,
                    notes=act.notes,
                )
            )

    db.commit()
    db.refresh(new_trip)
    return new_trip
