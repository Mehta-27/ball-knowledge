from sklearn.preprocessing import StandardScaler
import pandas as pd


class PlayerScaler:
    def __init__(self):
        self.scaler = StandardScaler()

    def fit_transform(self, df):
        metadata = [
            "player_id",
            "player_name",
            "team_id",
            "position",
        ]
        numerical_features = [
            "minutes_played",
            # Attacking
            "goals",
            "assists",
            "xg",
            "xa",
            "xg_non_penalty",
            "xg_plus_xa",
            "total_shots",
            "shots_on_target",
            "shots_off_target",
            "shot_accuracy",
            "blocked_shots",
            "shots_woodwork",
            # Possession
            "touches",
            "touches_opposition_box",
            "accurate_passes",
            "accurate_crosses",
            "long_balls_accurate",
            "passes_into_final_third",
            "corners",
            # Chance Creation
            "chances_created",
            "big_chances_created",
            # Defensive
            "tackles",
            "interceptions",
            "defensive_actions",
            "clearances",
            "headed_clearances",
            "recoveries",
            "duels_won",
            "duels_lost",
            "ground_duels_won",
            "aerials_won",
            # Ball Carrying
            "dribbles_succeeded",
            "dribbled_past",
            "dispossessed",
            "was_fouled",
            # Discipline
            "fouls",
            "offsides",
            "errors_led_to_goal",
            "player_throws",
            # Goalkeeper
            "saves",
            "saves_inside_box",
            "goals_conceded",
            "goals_prevented",
            "keeper_diving_saves",
            "keeper_high_claims",
            "keeper_sweeper_actions",
            "punches",
            "xg_on_target_faced",
            "xg_on_target_variant",
            # Rating
            "rating",
        ]

        metadata_df = df[metadata]
        numeric_df = df[numerical_features]

        scaled_features = self.scaler.fit_transform(numeric_df)

        scaled_df = pd.DataFrame(scaled_features, columns=numeric_df.columns)

        final_df = pd.concat([metadata_df, scaled_df], axis=1)
        return final_df
