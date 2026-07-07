import joblib
from pathlib import Path

ARTIFACTS_DIR = Path(__file__).resolve().parent.parent / "artifacts"

class PlayerSimilarityEngine:

    def __init__(self):
        self.scaler = joblib.load(
            ARTIFACTS_DIR / "player_scaler.pkl"
        )

        self.similarity_matrix = joblib.load(
            ARTIFACTS_DIR / "player_similarity.pkl"
        )

        self.player_index = joblib.load(
            ARTIFACTS_DIR / "player_index.pkl"
        )

    def get_similar_player(self,player_id:int):

        player_row = self.player_index[
            self.player_index["player_id"] == player_id
        ]
        if player_row.empty:
            raise ValueError(f"player with id: {player_id} has no values ")

        player_idx = player_row.index[0]

        similarity_scores = self.similarity_matrix[player_idx]

        sorted_indices = similarity_scores.argsort()[::-1]

        sorted_indices = sorted_indices[1:]

        top_indices = sorted_indices[:10]

        results = []
        for idx in top_indices:
            player = self.player_index.iloc[idx]
            
            results.append(
                {
                "player_id": int(player["player_id"]),
                "player_name": player["player_name"],
                "team_id": int(player["team_id"]),
                "position": player["position"],
                "similarity": float(similarity_scores[idx]),
                }
            )
        return results




        