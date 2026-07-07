from sqlalchemy import BigInteger, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base
from datetime import datetime


class MatchMappingORM(Base):
    __tablename__ = "match_mappings"

    fifa_match_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    fotmob_match_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    fotmob_page_url: Mapped[str | None] = mapped_column(String(200), nullable=True)
    home_team_name: Mapped[str] = mapped_column(String(100), nullable=False)
    away_team_name: Mapped[str] = mapped_column(String(100), nullable=False)
    match_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    confidence: Mapped[str] = mapped_column(String(20), nullable=False)
    matched_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
