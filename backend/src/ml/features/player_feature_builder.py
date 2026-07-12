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

    def _safe_avg(self, stats, field: str) -> float:
        valid = [
            getattr(stat, field) for stat in stats if getattr(stat, field) is not None
        ]
        return sum(valid) / len(valid) if valid else 0.0

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
            if not stats:
                continue

            minutes_played = self._safe_sum(stats, "minutes_played")

            # Skip players with < 45 total minutes (less than one half)
            if minutes_played < 45:
                continue

            # Per-90 divisor
            per90 = minutes_played / 90.0

            def p90(field: str) -> float:
                return self._safe_sum(stats, field) / per90

            feature = PlayerFeature(
                player_id=player.id,
                player_name=player.name,
                team_id=player.team_id,
                position=player.position,
                # Volume
                minutes_played=minutes_played,
                # Attacking (per-90)
                goals=p90("goals"),
                assists=p90("assists"),
                xg=p90("xG"),
                xa=p90("xA"),
                xg_non_penalty=p90("xG_non_penalty"),
                xg_plus_xa=p90("xG_plus_xA"),
                total_shots=p90("total_shots"),
                shots_on_target=p90("shots_on_target"),
                shots_off_target=p90("shots_off_target"),
                shot_accuracy=p90("shot_accuracy"),
                blocked_shots=p90("blocked_shots"),
                shots_woodwork=p90("shots_woodwork"),
                # Possession / Passing (per-90)
                touches=p90("touches"),
                touches_opposition_box=p90("touches_opposition_box"),
                accurate_passes=p90("accurate_passes"),
                accurate_crosses=p90("accurate_crosses"),
                long_balls_accurate=p90("long_balls_accurate"),
                passes_into_final_third=p90("passes_into_final_third"),
                corners=p90("corners"),
                # Chance Creation (per-90)
                chances_created=p90("chances_created"),
                big_chances_created=p90("big_chances_created"),
                # Defensive (per-90)
                tackles=p90("tackles"),
                interceptions=p90("interceptions"),
                defensive_actions=p90("defensive_actions"),
                clearances=p90("clearances"),
                headed_clearances=p90("headed_clearances"),
                recoveries=p90("recoveries"),
                duels_won=p90("duels_won"),
                duels_lost=p90("duels_lost"),
                ground_duels_won=p90("ground_duels_won"),
                aerials_won=p90("aerials_won"),
                # Ball Carrying (per-90)
                dribbles_succeeded=p90("dribbles_succeeded"),
                dribbled_past=p90("dribbled_past"),
                dispossessed=p90("dispossessed"),
                was_fouled=p90("was_fouled"),
                # Discipline (per-90)
                fouls=p90("fouls"),
                offsides=p90("offsides"),
                errors_led_to_goal=p90("errors_led_to_goal"),
                player_throws=p90("player_throws"),
                # Goalkeeper (per-90)
                saves=p90("saves"),
                saves_inside_box=p90("saves_inside_box"),
                goals_conceded=p90("goals_conceded"),
                goals_prevented=p90("goals_prevented"),
                keeper_diving_saves=p90("keeper_diving_saves"),
                keeper_high_claims=p90("keeper_high_claims"),
                keeper_sweeper_actions=p90("keeper_sweeper_actions"),
                punches=p90("punches"),
                xg_on_target_faced=p90("xG_on_target_faced"),
                xg_on_target_variant=p90("xG_on_target_variant"),
                # Rating (average, not per-90)
                rating=self._safe_avg(stats, "rating"),
            )

            features.append(feature)

        feature_dicts = [asdict(f) for f in features]
        return pd.DataFrame(feature_dicts)
