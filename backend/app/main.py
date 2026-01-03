from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, engine
import app.models  # noqa: F401
from app.routers import (
    activities,
    admin,
    attractions,
    auth,
    budget,
    cities,
    community,
    expenses,
    public,
    stops,
    trips,
    users,
)


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["*"] ,
        allow_headers=["*"],
    )

    if settings.auto_create_tables:
        Base.metadata.create_all(bind=engine)

    app.include_router(auth.router, prefix="/api")
    app.include_router(users.router, prefix="/api")
    app.include_router(trips.router, prefix="/api")
    app.include_router(cities.router, prefix="/api")
    app.include_router(stops.router, prefix="/api")
    app.include_router(activities.router, prefix="/api")
    app.include_router(attractions.router, prefix="/api")
    app.include_router(budget.router, prefix="/api")
    app.include_router(expenses.router, prefix="/api")
    app.include_router(community.router, prefix="/api")
    app.include_router(admin.router, prefix="/api")
    app.include_router(public.router, prefix="/api")

    return app


app = create_app()
