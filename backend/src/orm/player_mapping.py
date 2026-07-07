from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base


class PlayerMappingORM(Base):
    __tablename__ = "player_mappings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    fifa_player_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    fotmob_player_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    match_type: Mapped[str] = mapped_column(String(20), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
