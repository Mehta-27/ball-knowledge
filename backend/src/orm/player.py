from sqlalchemy import Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base
from datetime import datetime


class PlayerORM(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey("teams.id"), index=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    short_name: Mapped[str] = mapped_column(String(50), nullable=False)

    jersey_number: Mapped[int] = mapped_column(Integer, nullable=False)

    position_code: Mapped[int] = mapped_column(Integer, nullable=False)

    position: Mapped[str] = mapped_column(String(30), nullable=False)

    birth_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    height: Mapped[float | None] = mapped_column(Float, nullable=True)

    weight: Mapped[float | None] = mapped_column(Float, nullable=True)

    country: Mapped[str] = mapped_column(String(5), nullable=False)

    picture_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
