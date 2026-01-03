from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Stop(Base):
    __tablename__ = "stops"

    id: Mapped[int] = mapped_column(primary_key=True)
    trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"), index=True)
    city_id: Mapped[int] = mapped_column(ForeignKey("cities.id"), index=True)

    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    order_index: Mapped[int] = mapped_column(Integer, default=0)

    stay_cost: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    transport_cost: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    meals_cost: Mapped[float] = mapped_column(Numeric(12, 2), default=0)

    trip: Mapped["Trip"] = relationship(back_populates="stops")
    city: Mapped["City"] = relationship()
    activities: Mapped[list["Activity"]] = relationship(back_populates="stop", cascade="all, delete-orphan")
