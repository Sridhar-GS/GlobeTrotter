from fastapi import APIRouter, Depends
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.city import City

router = APIRouter(prefix="/cities", tags=["cities"])


@router.get("/top")
def top_cities(limit: int = 8, region: str | None = None, db: Session = Depends(get_db)):
    limit = max(1, min(24, limit))
    q = db.query(City)
    if region:
        q = q.filter(City.region.ilike(region))
    rows = q.order_by(City.popularity.desc().nullslast(), City.name.asc()).limit(limit).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "country": c.country,
            "region": c.region,
            "cost_index": c.cost_index,
            "popularity": c.popularity,
            "image_url": c.image_url,
        }
        for c in rows
    ]


@router.get("")
def search_cities(
    query: str | None = None,
    country: str | None = None,
    region: str | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(City)
    if query:
        like = f"%{query}%"
        q = q.filter(or_(City.name.ilike(like), City.country.ilike(like)))
    if country:
        q = q.filter(City.country.ilike(country))
    if region:
        q = q.filter(City.region.ilike(region))

    rows = q.order_by(City.popularity.desc().nullslast(), City.name.asc()).limit(50).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "country": c.country,
            "region": c.region,
            "cost_index": c.cost_index,
            "popularity": c.popularity,
            "image_url": c.image_url,
        }
        for c in rows
    ]
