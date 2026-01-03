from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.activity import Activity
from app.models.city import City
from app.models.stop import Stop
from app.models.trip import Trip
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    rows = db.query(User).order_by(User.created_at.desc()).limit(200).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "name": u.name,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "created_at": u.created_at,
            "is_admin": bool(u.is_admin),
        }
        for u in rows
    ]


@router.get("/analytics/popular-cities")
def popular_cities(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    rows = (
        db.query(City.name, City.country, func.count(Stop.id).label("count"))
        .join(Stop, Stop.city_id == City.id)
        .group_by(City.id)
        .order_by(func.count(Stop.id).desc())
        .limit(10)
        .all()
    )
    return [{"name": n, "country": c, "count": int(cnt)} for (n, c, cnt) in rows]


@router.get("/analytics/popular-activities")
def popular_activities(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    rows = (
        db.query(Activity.type, func.count(Activity.id).label("count"))
        .group_by(Activity.type)
        .order_by(func.count(Activity.id).desc())
        .limit(10)
        .all()
    )
    return [{"type": t or "-", "count": int(cnt)} for (t, cnt) in rows]


@router.get("/analytics/trips-per-month")
def trips_per_month(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    # month based on trip.start_date
    rows = (
        db.query(func.date_trunc("month", Trip.start_date).label("month"), func.count(Trip.id).label("count"))
        .group_by(func.date_trunc("month", Trip.start_date))
        .order_by(func.date_trunc("month", Trip.start_date).asc())
        .limit(24)
        .all()
    )

    result = []
    for (month_dt, cnt) in rows:
        if isinstance(month_dt, date):
            key = month_dt.isoformat()[:7]
        else:
            key = str(month_dt)[:7]
        result.append({"month": key, "count": int(cnt)})
    return result
