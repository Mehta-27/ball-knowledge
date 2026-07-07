from repositories.player_repository import PlayerRepository
from repositories.player_mapping_repository import PlayerMappingRepository
from repositories.player_match_stat_repository import PlayerMatchStatRepository
from collections import defaultdict
from .player_feature import PlayerFeature
from dataclasses import asdict
import pandas as pd


class PlayerFeatureBuilder:
    def __init__(
        self,
        player_repository: PlayerRepository,
        player_mapping_repository: PlayerMappingRepository,
        player_match_stat_repository: PlayerMatchStatRepository,
    ):
        self.player_repository = player_repository
        self.player_mapping_repository = player_mapping_repository
        self.player_match_stat_repository = player_match_stat_repository

    def _safe_sum(self, stats, field: str) -> float:
        return sum(getattr(stat, field) or 0 for stat in stats)

    def build(self):
        players = self.player_repository.get_all()
        mappings = self.player_mapping_repository.get_all()
        player_stats = self.player_match_stat_repository.get_all()

        mapping_by_fifa = {mapping.fifa_player_id: mapping for mapping in mappings}

        stats_by_fotmob = defaultdict(list)
        for stat in player_stats:
            stats_by_fotmob[stat.fotmob_player_id].append(stat)

        features = []

        for player in players:
            mapping = mapping_by_fifa.get(player.id)
            if mapping is None:
                continue

            stats = stats_by_fotmob.get(mapping.fotmob_player_id, [])

            # Playing Time
            minutes_played = self._safe_sum(stats, "minutes_played")

            # Attacking
            goals = self._safe_sum(stats, "goals")
            assists = self._safe_sum(stats, "assists")
            xg = self._safe_sum(stats, "xG")
            xa = self._safe_sum(stats, "xA")
            total_shots = self._safe_sum(stats, "total_shots")
            shots_on_target = self._safe_sum(stats, "shots_on_target")

            # Possession
            touches = self._safe_sum(stats, "touches")
            accurate_passes = self._safe_sum(stats, "accurate_passes")

            # Defensive
            tackles = self._safe_sum(stats, "tackles")
            interceptions = self._safe_sum(stats, "interceptions")
            duels_won = self._safe_sum(stats, "duels_won")

            # Ball Carrying
            dribbles_succeeded = self._safe_sum(stats, "dribbles_succeeded")

            # Overall Rating
            valid_ratings = [stat.rating for stat in stats if stat.rating is not None]

            rating = sum(valid_ratings) / len(valid_ratings) if valid_ratings else 0.0

            feature = PlayerFeature(
                player_id=player.id,
                player_name=player.name,
                team_id=player.team_id,
                position=player.position,
                # Playing Time
                minutes_played=minutes_played,
                # Attacking
                goals=goals,
                assists=assists,
                xg=xg,
                xa=xa,
                total_shots=total_shots,
                shots_on_target=shots_on_target,
                # Possession
                touches=touches,
                accurate_passes=accurate_passes,
                # Defensive
                tackles=tackles,
                interceptions=interceptions,
                duels_won=duels_won,
                # Ball Carrying
                dribbles_succeeded=dribbles_succeeded,
                # Overall
                rating=rating,
            )

            features.append(feature)
            feature_dicts = [asdict(feature) for feature in features]

        return pd.DataFrame(feature_dicts)
