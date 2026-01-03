import secrets

from sqlalchemy.orm import Session

from app.models.shared_trip import SharedTrip
from app.models.trip import Trip


def get_or_create_share(db: Session, trip: Trip) -> SharedTrip:
    if trip.shared:
        return trip.shared

    share = SharedTrip(trip_id=trip.id, share_id=secrets.token_urlsafe(8), is_public=True)
    db.add(share)
    db.commit()
    db.refresh(share)
    return share


def get_public_trip_by_share_id(db: Session, share_id: str) -> Trip | None:
    share = db.query(SharedTrip).filter(SharedTrip.share_id == share_id, SharedTrip.is_public.is_(True)).first()
    if not share:
        return None
    return db.get(Trip, share.trip_id)
