from sqlalchemy.orm import Session
from orm.player_mapping import PlayerMappingORM


class PlayerMappingRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert(self, mapping: PlayerMappingORM) -> str:
        try:
            existing = (
                self.session.query(PlayerMappingORM)
                .filter(PlayerMappingORM.fifa_player_id == mapping.fifa_player_id)
                .first()
            )
            if existing is None:
                self.session.add(mapping)
                result = "inserted"
            else:
                existing.fotmob_player_id = mapping.fotmob_player_id
                existing.match_type = mapping.match_type
                existing.confidence = mapping.confidence
                result = "updated"
            self.session.commit()
            return result
        except Exception:
            self.session.rollback()
            raise

    def get_all(self) -> list[PlayerMappingORM]:
        return self.session.query(PlayerMappingORM).all()

    def get_by_fifa_id(self, fifa_player_id: int) -> PlayerMappingORM | None:
        return (
            self.session.query(PlayerMappingORM)
            .filter(PlayerMappingORM.fifa_player_id == fifa_player_id)
            .first()
        )

    def get_by_fotmob_id(self, fotmob_player_id: int) -> PlayerMappingORM | None:
        return (
            self.session.query(PlayerMappingORM)
            .filter(PlayerMappingORM.fotmob_player_id == fotmob_player_id)
            .first()
        )
