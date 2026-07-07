from ml.features.player_feature_builder import PlayerFeatureBuilder
from ml.preprocessing.player_scaler import PlayerScaler
from sklearn.metrics.pairwise import cosine_similarity
import joblib

class PlayerSimilarityTrainer:

    def __init__(
        self,
        feature_builder: PlayerFeatureBuilder,
        player_scaler: PlayerScaler
    ):
        self.feature_builder = feature_builder
        self.player_scaler = player_scaler

    def train(self):
        df = self.feature_builder.build()
        scaled_df = self.player_scaler.fit_transform(df)

        metadata = scaled_df[["player_id","player_name", "team_id", "position"]] 
        feature_vectors = scaled_df.drop(
            columns=[
                "player_id","player_name", "team_id", "position"
            ]
        )

        similarity_matrix = cosine_similarity(feature_vectors)

        joblib.dump(
            self.player_scaler.scaler,
            "src/ml/artifacts/player_scaler.pkl",
        )
        joblib.dump(
            similarity_matrix,
            "src/ml/artifacts/player_similarity.pkl"
        )
        joblib.dump(
            metadata,
            "src/ml/artifacts/player_index.pkl"
        )
        print("SAVED BOOOOOOM")