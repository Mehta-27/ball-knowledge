from sqlalchemy.orm import Session
from sqlalchemy import text
from orm.standing import StandingORM
from orm.group import GroupORM


class StandingRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert_all(self, standings: list[StandingORM]):
        try:
            for standing in standings:
                existing_standing = self.session.get(StandingORM, standing.id)
                if existing_standing is None:
                    self.session.add(standing)
                else:
                    existing_standing.played = standing.played
                    existing_standing.won = standing.won
                    existing_standing.drawn = standing.drawn
                    existing_standing.lost = standing.lost
                    existing_standing.goals_for = standing.goals_for
                    existing_standing.goals_against = standing.goals_against
                    existing_standing.goal_difference = standing.goal_difference
                    existing_standing.points = standing.points
                    existing_standing.position = standing.position
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def get_by_team_id(self, team_id: int) -> StandingORM | None:
        return (
            self.session.query(StandingORM)
            .filter(StandingORM.team_id == team_id)
            .first()
        )

    def get_all(self) -> list[StandingORM]:
        return self.session.query(StandingORM).all()

    def get_by_group_id(self, group_id: int) -> list[StandingORM]:
        return (
            self.session.query(StandingORM)
            .filter(StandingORM.group_id == group_id)
            .order_by(StandingORM.position)
            .all()
        )

    def get_by_group_name(self, group_name: str) -> list[StandingORM]:
        return (
            self.session.query(StandingORM)
            .join(GroupORM, StandingORM.group_id == GroupORM.id)
            .filter(GroupORM.name == group_name)
            .order_by(StandingORM.position)
            .all()
        )
