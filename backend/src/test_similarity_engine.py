from ml.inference.player_similarity_engine import PlayerSimilarityEngine


def main():

    engine = PlayerSimilarityEngine()

    result = engine.get_similar_player(229397)

    for player in result:
        print(player)


if __name__ == "__main__":
    main()
