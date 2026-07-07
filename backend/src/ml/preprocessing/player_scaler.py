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
            "goals",
            "assists",
            "xg",
            "xa",
            "total_shots",
            "shots_on_target",
            "touches",
            "accurate_passes",
            "tackles",
            "interceptions",
            "duels_won",
            "dribbles_succeeded",
            "rating",
        ]

        metadata_df = df[metadata]
        numeric_df = df[numerical_features]

        scaled_features = self.scaler.fit_transform(numeric_df)

        scaled_df = pd.DataFrame(scaled_features, columns=numeric_df.columns)

        final_df = pd.concat([metadata_df, scaled_df], axis=1)
        return final_df
