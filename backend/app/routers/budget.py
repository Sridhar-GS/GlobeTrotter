from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.budget import BudgetSummaryResponse
from app.services.budget_service import compute_budget_summary
from app.services.trip_service import get_trip_for_user

router = APIRouter(prefix="/budget", tags=["budget"])


@router.get("/trips/{trip_id}", response_model=BudgetSummaryResponse)
def get_budget(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_trip_for_user(db, current_user.id, trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    summary = compute_budget_summary(db, trip)
    return BudgetSummaryResponse(**summary)
