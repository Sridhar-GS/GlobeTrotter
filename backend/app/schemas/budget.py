from pydantic import BaseModel


class BudgetSummaryResponse(BaseModel):
    trip_id: int

    transport: float
    stay: float
    meals: float
    activities: float
    other: float

    total: float
    average_per_day: float
    over_budget: bool
    budget_limit: float | None = None
