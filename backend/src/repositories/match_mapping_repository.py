from sqlalchemy.orm import Session
from sqlalchemy import text
from orm.match_mapping import MatchMappingORM


class MatchMappingRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert(self, mapping: MatchMappingORM):
        try:
            existing = self.session.get(MatchMappingORM, mapping.fifa_match_id)
            if existing is None:
                self.session.add(mapping)
            else:
                existing.fotmob_match_id = mapping.fotmob_match_id
                existing.fotmob_page_url = mapping.fotmob_page_url
                existing.home_team_name = mapping.home_team_name
                existing.away_team_name = mapping.away_team_name
                existing.match_date = mapping.match_date
                existing.confidence = mapping.confidence
                existing.matched_at = mapping.matched_at
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def get_all(self) -> list[MatchMappingORM]:
        return self.session.query(MatchMappingORM).all()

    def get_by_fifa_id(self, fifa_match_id: int) -> MatchMappingORM | None:
        return self.session.get(MatchMappingORM, fifa_match_id)

    def get_unmapped_fifa_ids(self) -> list[int]:
        rows = self.session.execute(
            text(
                "SELECT m.id FROM matches m LEFT JOIN match_mappings mm ON m.id = mm.fifa_match_id WHERE mm.fifa_match_id IS NULL"
            )
        ).fetchall()
        return [row[0] for row in rows]
