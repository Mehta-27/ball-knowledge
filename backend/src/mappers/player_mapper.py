from models.player import Player
from orm.player import PlayerORM

def player_to_orm(player: Player) -> PlayerORM:
    return PlayerORM(
        id = player.id,
        team_id = player.team_id,
        name = player.name,
        short_name = player.short_name,
        jersey_number = player.jersey_number,
        position_code = player.position_code,
        position = player.position,
        birth_date = player.birth_date,
        height = player.height,
        weight = player.weight,
        country = player.country,
        picture_url=str(player.picture_url) if player.picture_url else None    
        )
