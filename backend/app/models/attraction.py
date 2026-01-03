from sqlalchemy import Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

class Attraction(Base):
    __tablename__ = "attractions"

    id: Mapped[int] = mapped_column(primary_key=True)
    city_id: Mapped[int] = mapped_column(ForeignKey("cities.id"))
    name: Mapped[str] = mapped_column(String)
    type: Mapped[str | None] = mapped_column(String, nullable=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    cost: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    rating: Mapped[float | None] = mapped_column(Numeric(3, 2), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
