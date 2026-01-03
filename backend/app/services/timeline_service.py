from collections import defaultdict
from datetime import date

from app.models.trip import Trip


def group_activities_by_day(trip: Trip) -> dict[date, list]:
    by_day: dict[date, list] = defaultdict(list)
    for stop in trip.stops:
        for act in stop.activities:
            if act.start_time:
                by_day[act.start_time.date()].append(act)
    return dict(by_day)
