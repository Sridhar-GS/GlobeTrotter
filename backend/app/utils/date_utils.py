from datetime import date, timedelta


def days_inclusive(start: date, end: date) -> int:
    if end < start:
        return 0
    return (end - start).days + 1


def daterange(start: date, end: date):
    current = start
    while current <= end:
        yield current
        current += timedelta(days=1)
