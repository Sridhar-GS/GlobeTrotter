from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.models.expense import Expense
from app.models.stop import Stop
from app.models.trip import Trip
from app.utils.date_utils import days_inclusive
from app.utils.response_utils import to_float


def compute_budget_summary(db: Session, trip: Trip, *, budget_limit: float | None = None) -> dict:
    limit = budget_limit if budget_limit is not None else (float(trip.budget) if trip.budget is not None else None)

    stop_totals = db.execute(
        select(
            func.coalesce(func.sum(Stop.transport_cost), 0),
            func.coalesce(func.sum(Stop.stay_cost), 0),
            func.coalesce(func.sum(Stop.meals_cost), 0),
        ).where(Stop.trip_id == trip.id)
    ).one()

    activities_total = db.execute(
        select(func.coalesce(func.sum(Activity.cost), 0)).join(Stop, Stop.id == Activity.stop_id).where(Stop.trip_id == trip.id)
    ).scalar_one()

    other_total = db.execute(
        select(func.coalesce(func.sum(Expense.amount), 0)).where(Expense.trip_id == trip.id)
    ).scalar_one()

    transport, stay, meals = [to_float(x) for x in stop_totals]
    activities = to_float(activities_total)
    other = to_float(other_total)
    total = transport + stay + meals + activities + other

    day_count = max(1, days_inclusive(trip.start_date, trip.end_date))
    average_per_day = total / day_count

    over_budget = limit is not None and total > limit

    return {
        "trip_id": trip.id,
        "transport": transport,
        "stay": stay,
        "meals": meals,
        "activities": activities,
        "other": other,
        "total": total,
        "average_per_day": average_per_day,
        "over_budget": over_budget,
        "budget_limit": limit,
    }
