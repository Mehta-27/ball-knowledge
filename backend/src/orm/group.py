from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from database.base import Base


class GroupORM(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    stage_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("stages.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(50), nullable=False)
