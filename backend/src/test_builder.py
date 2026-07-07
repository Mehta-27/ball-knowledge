from database.connection import SessionLocal

from repositories.player_repository import PlayerRepository
from repositories.player_mapping_repository import PlayerMappingRepository
from repositories.player_match_stat_repository import PlayerMatchStatRepository

from ml.features.player_feature_builder import PlayerFeatureBuilder
import pandas


def main():
    # Create database session
    session = SessionLocal()

    try:
        # Create repositories
        player_repository = PlayerRepository(session)
        player_mapping_repository = PlayerMappingRepository(session)
        player_match_stat_repository = PlayerMatchStatRepository(session)

        # Create builder
        builder = PlayerFeatureBuilder(
            player_repository,
            player_mapping_repository,
            player_match_stat_repository,
        )

        # Build features
        features = builder.build()

        # Display results
        print(features.head())
        print()
        print(f"Total Players: {len(features)}")

    finally:
        session.close()


if __name__ == "__main__":
    main()