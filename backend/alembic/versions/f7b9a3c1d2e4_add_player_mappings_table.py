"""add player_mappings table

Revision ID: f7b9a3c1d2e4
Revises: dbe967dbeb47
Create Date: 2026-07-04 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f7b9a3c1d2e4"
down_revision: Union[str, Sequence[str], None] = "dbe967dbeb47"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "player_mappings",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("fifa_player_id", sa.Integer(), nullable=False),
        sa.Column("fotmob_player_id", sa.Integer(), nullable=False),
        sa.Column("match_type", sa.String(length=20), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("fifa_player_id"),
        sa.UniqueConstraint("fotmob_player_id"),
    )


def downgrade() -> None:
    op.drop_table("player_mappings")
