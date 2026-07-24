from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base


class TeamORM(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(5), nullable=False)
    continent: Mapped[str] = mapped_column(String(30), nullable=False)
    confederation: Mapped[str] = mapped_column(String(20), nullable=False)
    current_stage: Mapped[str | None] = mapped_column(
        String(15), nullable=True, default=None
    )
    coach: Mapped[str | None] = mapped_column(String(100), nullable=True)
    rank: Mapped[int | None] = mapped_column(Integer, nullable=True)
    flag_url: Mapped[str] = mapped_column(String(500), nullable=False)
