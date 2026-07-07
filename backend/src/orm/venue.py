from sqlalchemy import Integer, String, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base


class VenueORM(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    country: Mapped[str] = mapped_column(String(5), nullable=False)
    capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    roof: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    turf: Mapped[str | None] = mapped_column(String(50), nullable=True)
    picture_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
