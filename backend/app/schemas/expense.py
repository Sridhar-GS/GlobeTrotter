from datetime import date

from pydantic import BaseModel


class ExpenseResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    trip_id: int
    expense_date: date | None = None
    category: str
    amount: float
    notes: str | None = None


class ExpenseCreate(BaseModel):
    expense_date: date | None = None
    category: str
    amount: float = 0
    notes: str | None = None


class ExpenseUpdate(BaseModel):
    expense_date: date | None = None
    category: str | None = None
    amount: float | None = None
    notes: str | None = None
