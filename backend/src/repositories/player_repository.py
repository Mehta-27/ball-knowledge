from sqlalchemy.orm import Session
from orm.player import PlayerORM
from orm.match import MatchORM
from orm.player_match_stat import PlayerMatchStatORM


class PlayerRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert_all(self, players: list[PlayerORM]):
        try:
            for player in players:
                existing_player = self.session.get(PlayerORM, player.id)

                if existing_player is None:
                    self.session.add(player)
                else:
                    existing_player.name = player.name
                    existing_player.short_name = player.short_name
                    existing_player.team_id = player.team_id
                    existing_player.jersey_number = player.jersey_number
                    existing_player.position = player.position
                    existing_player.position_code = player.position_code
                    existing_player.birth_date = player.birth_date
                    existing_player.height = player.height
                    existing_player.weight = player.weight
                    existing_player.country = player.country
                    existing_player.picture_url = player.picture_url
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def get_by_team_id(self, team_id: int) -> list[PlayerORM]:
        return self.session.query(PlayerORM).filter(PlayerORM.team_id == team_id).all()

    def get_all(self) -> list[PlayerORM]:
        return self.session.query(PlayerORM).all()

    def get_by_id(self, player_id: int) -> PlayerORM | None:
        return self.session.get(PlayerORM, player_id)

    def get_paginated(
        self,
        limit: int = 25,
        offset: int = 0,
        search: str | None = None,
        team_id: int | None = None,
        position: str | None = None,
    ) -> tuple[list[PlayerORM], int]:
        query = self.session.query(PlayerORM)
        if search:
            query = query.filter(PlayerORM.name.ilike(f"%{search}%"))
        if team_id is not None:
            query = query.filter(PlayerORM.team_id == team_id)
        if position:
            query = query.filter(PlayerORM.position.ilike(f"%{position}%"))
        total = query.count()
        items = query.order_by(PlayerORM.name).offset(offset).limit(limit).all()
        return items, total

    def search(self, query: str, limit: int = 10) -> list[PlayerORM]:
        return (
            self.session.query(PlayerORM)
            .filter(PlayerORM.name.ilike(f"%{query}%"))
            .limit(limit)
            .all()
        )
