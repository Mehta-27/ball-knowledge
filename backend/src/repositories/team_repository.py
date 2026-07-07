from sqlalchemy.orm import Session
from sqlalchemy import func

from orm.team import TeamORM


class TeamRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert_all(self, teams: list[TeamORM]):
        try:
            for team in teams:
                existing_team = self.session.get(TeamORM, team.id)

                if existing_team is None:
                    self.session.add(team)
                else:
                    existing_team.current_stage = team.current_stage
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def get_all(self) -> list[TeamORM]:
        return self.session.query(TeamORM).all()

    def get_by_id(self, team_id: int) -> TeamORM | None:
        return self.session.get(TeamORM, team_id)

    def get_paginated(
        self, limit: int = 25, offset: int = 0, search: str | None = None
    ) -> tuple[list[TeamORM], int]:
        query = self.session.query(TeamORM)
        if search:
            query = query.filter(TeamORM.name.ilike(f"%{search}%"))
        total = query.count()
        items = query.order_by(TeamORM.name).offset(offset).limit(limit).all()
        return items, total

    def search(self, query: str, limit: int = 10) -> list[TeamORM]:
        return (
            self.session.query(TeamORM)
            .filter(TeamORM.name.ilike(f"%{query}%"))
            .limit(limit)
            .all()
        )
