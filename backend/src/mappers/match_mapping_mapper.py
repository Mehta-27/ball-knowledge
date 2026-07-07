from models.match_mapping import MatchMapping
from orm.match_mapping import MatchMappingORM
from datetime import datetime, timezone


def match_mapping_to_orm(mapping: MatchMapping) -> MatchMappingORM:
    return MatchMappingORM(
        fifa_match_id=mapping.fifa_match_id,
        fotmob_match_id=mapping.fotmob_match_id,
        fotmob_page_url=mapping.fotmob_page_url,
        home_team_name=mapping.home_team_name,
        away_team_name=mapping.away_team_name,
        match_date=mapping.match_date,
        confidence=mapping.confidence,
        matched_at=datetime.now(timezone.utc),
    )
