from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base
from datetime import datetime


class MatchORM(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    home_team_id: Mapped[int] = mapped_column(Integer, ForeignKey("teams.id"))
    away_team_id: Mapped[int] = mapped_column(Integer, ForeignKey("teams.id"))
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    season_id: Mapped[int] = mapped_column(Integer, nullable=False)
    competition_id: Mapped[int] = mapped_column(Integer, nullable=False)
    home_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    away_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    home_tactics: Mapped[str | None] = mapped_column(String(50), nullable=True)
    away_tactics: Mapped[str | None] = mapped_column(String(50), nullable=True)
    venue_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("venues.id"), nullable=True
    )
    group_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    stage_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    group: Mapped[str | None] = mapped_column(String(50), nullable=True)
    stage: Mapped[str | None] = mapped_column(String(50), nullable=True)
    local_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    attendance: Mapped[int | None] = mapped_column(Integer, nullable=True)
