from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.attraction import Attraction
from app.utils.response_utils import to_float

router = APIRouter(prefix="/attractions", tags=["attractions"])

@router.get("")
def search_attractions(
    city_id: int | None = None,
    query: str | None = None,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    q = db.query(Attraction)
    if city_id:
        q = q.filter(Attraction.city_id == city_id)
    if query:
        q = q.filter(Attraction.name.ilike(f"%{query}%"))
        
    rows = q.limit(limit).all()
    return [
        {
            "id": a.id,
            "city_id": a.city_id,
            "name": a.name,
            "type": a.type,
            "description": a.description,
            "cost": to_float(a.cost),
            "rating": to_float(a.rating),
            "image_url": a.image_url,
        }
        for a in rows
    ]

@router.get("/{attraction_id}")
def get_attraction(attraction_id: int, db: Session = Depends(get_db)):
    attraction = db.get(Attraction, attraction_id)
    if not attraction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attraction not found")
    return {
        "id": attraction.id,
        "city_id": attraction.city_id,
        "name": attraction.name,
        "type": attraction.type,
        "description": attraction.description,
        "cost": to_float(attraction.cost),
        "rating": to_float(attraction.rating),
        "image_url": attraction.image_url,
    }
