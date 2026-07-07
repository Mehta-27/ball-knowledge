from models.player_mapping import PlayerMapping
from orm.player_mapping import PlayerMappingORM


def player_mapping_to_orm(mapping: PlayerMapping) -> PlayerMappingORM:
    return PlayerMappingORM(
        fifa_player_id=mapping.fifa_player_id,
        fotmob_player_id=mapping.fotmob_player_id,
        match_type=mapping.match_type,
        confidence=mapping.confidence,
    )
