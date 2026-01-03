from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.activity import Activity
from app.models.stop import Stop
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityResponse, ActivitySuggestion, ActivityUpdate
from app.services.trip_service import get_trip_for_user
from app.utils.response_utils import to_float

router = APIRouter(tags=["activities"])


@router.get("/stops/{stop_id}/activities", response_model=list[ActivityResponse])
def list_activities(stop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.get(Stop, stop_id)
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    trip = get_trip_for_user(db, current_user.id, stop.trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    rows = db.query(Activity).filter(Activity.stop_id == stop.id).order_by(Activity.start_time.asc().nullslast(), Activity.id.asc()).all()
    return [
        ActivityResponse(
            id=a.id,
            stop_id=a.stop_id,
            name=a.name,
            type=a.type,
            start_time=a.start_time,
            duration_minutes=a.duration_minutes,
            cost=to_float(a.cost),
            notes=a.notes,
        )
        for a in rows
    ]


@router.post("/stops/{stop_id}/activities", response_model=ActivityResponse)
def create_activity(
    stop_id: int,
    payload: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stop = db.get(Stop, stop_id)
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    trip = get_trip_for_user(db, current_user.id, stop.trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    activity = Activity(stop_id=stop.id, **payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)

    return ActivityResponse(
        id=activity.id,
        stop_id=activity.stop_id,
        name=activity.name,
        type=activity.type,
        start_time=activity.start_time,
        duration_minutes=activity.duration_minutes,
        cost=to_float(activity.cost),
        notes=activity.notes,
    )


@router.patch("/activities/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: int,
    payload: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = db.get(Activity, activity_id)
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    stop = db.get(Stop, activity.stop_id)
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    trip = get_trip_for_user(db, current_user.id, stop.trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(activity, field, value)

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return ActivityResponse(
        id=activity.id,
        stop_id=activity.stop_id,
        name=activity.name,
        type=activity.type,
        start_time=activity.start_time,
        duration_minutes=activity.duration_minutes,
        cost=to_float(activity.cost),
        notes=activity.notes,
    )


@router.delete("/activities/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    activity = db.get(Activity, activity_id)
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    stop = db.get(Stop, activity.stop_id)
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    trip = get_trip_for_user(db, current_user.id, stop.trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    db.delete(activity)
    db.commit()
    return {"deleted": True}


@router.get("/activities/suggest", response_model=list[ActivitySuggestion])
def suggest_activities(query: str | None = None, type: str | None = None):
    catalog = [
        {"name": "City walking tour", "type": "Sightseeing", "typical_cost": 25, "typical_duration_minutes": 120},
        {"name": "Museum visit", "type": "Culture", "typical_cost": 18, "typical_duration_minutes": 90},
        {"name": "Food tour", "type": "Food", "typical_cost": 60, "typical_duration_minutes": 180},
        {"name": "Boat ride", "type": "Leisure", "typical_cost": 30, "typical_duration_minutes": 60},
    ]

    def matches(item: dict) -> bool:
        if type and item.get("type") != type:
            return False
        if query and query.lower() not in item.get("name", "").lower():
            return False
        return True

    return [ActivitySuggestion(**i) for i in catalog if matches(i)]
