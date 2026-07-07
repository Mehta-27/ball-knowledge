from sqlalchemy.orm import Session, aliased
from orm.match import MatchORM
from orm.team import TeamORM
from orm.venue import VenueORM


class MatchRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert_all(self, matches: list[MatchORM]):
        try:
            for match in matches:
                existing_match = self.session.get(MatchORM, match.id)

                if existing_match is None:
                    self.session.add(match)

                else:
                    existing_match.home_team_id = match.home_team_id
                    existing_match.away_team_id = match.away_team_id
                    existing_match.date = match.date
                    existing_match.season_id = match.season_id
                    existing_match.competition_id = match.competition_id
                    existing_match.home_score = match.home_score
                    existing_match.away_score = match.away_score
                    existing_match.home_tactics = match.home_tactics
                    existing_match.away_tactics = match.away_tactics
                    existing_match.venue_id = match.venue_id
                    existing_match.group_id = match.group_id
                    existing_match.stage_id = match.stage_id
                    existing_match.group = match.group
                    existing_match.stage = match.stage
                    existing_match.attendance = match.attendance
                    existing_match.local_date = match.local_date
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def get_all(self) -> list[MatchORM]:
        return self.session.query(MatchORM).order_by(MatchORM.date).all()

    def get_by_id(self, match_id: int) -> MatchORM | None:
        return self.session.get(MatchORM, match_id)

    def get_by_team_id(self, team_id: int) -> list[MatchORM]:
        return (
            self.session.query(MatchORM)
            .filter(
                (MatchORM.home_team_id == team_id) | (MatchORM.away_team_id == team_id)
            )
            .order_by(MatchORM.date)
            .all()
        )

    def count_by_venue_id(self, venue_id: int) -> int:
        return (
            self.session.query(MatchORM).filter(MatchORM.venue_id == venue_id).count()
        )

    def get_by_team_id_with_teams(
        self, team_id: int
    ) -> list[tuple[MatchORM, TeamORM, TeamORM]]:
        HomeTeam = aliased(TeamORM)
        AwayTeam = aliased(TeamORM)
        return (
            self.session.query(MatchORM, HomeTeam, AwayTeam)
            .join(HomeTeam, MatchORM.home_team_id == HomeTeam.id)
            .join(AwayTeam, MatchORM.away_team_id == AwayTeam.id)
            .filter(
                (MatchORM.home_team_id == team_id) | (MatchORM.away_team_id == team_id)
            )
            .order_by(MatchORM.date)
            .all()
        )

    def get_with_teams_by_id(
        self, match_id: int
    ) -> tuple[MatchORM, TeamORM, TeamORM, VenueORM | None] | None:
        HomeTeam = aliased(TeamORM)
        AwayTeam = aliased(TeamORM)
        result = (
            self.session.query(MatchORM, HomeTeam, AwayTeam, VenueORM)
            .join(HomeTeam, MatchORM.home_team_id == HomeTeam.id)
            .join(AwayTeam, MatchORM.away_team_id == AwayTeam.id)
            .outerjoin(VenueORM, MatchORM.venue_id == VenueORM.id)
            .filter(MatchORM.id == match_id)
            .first()
        )
        return result

    def get_paginated(
        self,
        limit: int = 25,
        offset: int = 0,
        team_id: int | None = None,
        stage_id: int | None = None,
        group_id: int | None = None,
        venue_id: int | None = None,
    ) -> tuple[list[MatchORM], int]:
        query = self.session.query(MatchORM)
        if team_id is not None:
            query = query.filter(
                (MatchORM.home_team_id == team_id) | (MatchORM.away_team_id == team_id)
            )
        if stage_id is not None:
            query = query.filter(MatchORM.stage_id == stage_id)
        if group_id is not None:
            query = query.filter(MatchORM.group_id == group_id)
        if venue_id is not None:
            query = query.filter(MatchORM.venue_id == venue_id)
        total = query.count()
        items = query.order_by(MatchORM.date.desc()).offset(offset).limit(limit).all()
        return items, total

    def get_by_stage_id(self, stage_id: int) -> list[MatchORM]:
        return (
            self.session.query(MatchORM)
            .filter(MatchORM.stage_id == stage_id)
            .order_by(MatchORM.date)
            .all()
        )

    def get_by_group_id(self, group_id: int) -> list[MatchORM]:
        return (
            self.session.query(MatchORM)
            .filter(MatchORM.group_id == group_id)
            .order_by(MatchORM.date)
            .all()
        )

    def get_by_venue_id(self, venue_id: int) -> list[MatchORM]:
        return (
            self.session.query(MatchORM)
            .filter(MatchORM.venue_id == venue_id)
            .order_by(MatchORM.date)
            .all()
        )

    def get_by_stage_id_with_teams(
        self, stage_id: int
    ) -> list[tuple[MatchORM, TeamORM, TeamORM]]:
        HomeTeam = aliased(TeamORM)
        AwayTeam = aliased(TeamORM)
        return (
            self.session.query(MatchORM, HomeTeam, AwayTeam)
            .join(HomeTeam, MatchORM.home_team_id == HomeTeam.id)
            .join(AwayTeam, MatchORM.away_team_id == AwayTeam.id)
            .filter(MatchORM.stage_id == stage_id)
            .order_by(MatchORM.date)
            .all()
        )

    def get_by_group_id_with_teams(
        self, group_id: int
    ) -> list[tuple[MatchORM, TeamORM, TeamORM]]:
        HomeTeam = aliased(TeamORM)
        AwayTeam = aliased(TeamORM)
        return (
            self.session.query(MatchORM, HomeTeam, AwayTeam)
            .join(HomeTeam, MatchORM.home_team_id == HomeTeam.id)
            .join(AwayTeam, MatchORM.away_team_id == AwayTeam.id)
            .filter(MatchORM.group_id == group_id)
            .order_by(MatchORM.date)
            .all()
        )

    def get_by_venue_id_with_teams(
        self, venue_id: int
    ) -> list[tuple[MatchORM, TeamORM, TeamORM]]:
        HomeTeam = aliased(TeamORM)
        AwayTeam = aliased(TeamORM)
        return (
            self.session.query(MatchORM, HomeTeam, AwayTeam)
            .join(HomeTeam, MatchORM.home_team_id == HomeTeam.id)
            .join(AwayTeam, MatchORM.away_team_id == AwayTeam.id)
            .filter(MatchORM.venue_id == venue_id)
            .order_by(MatchORM.date)
            .all()
        )

    def get_paginated_with_teams(
        self,
        limit: int = 25,
        offset: int = 0,
        team_id: int | None = None,
        stage_id: int | None = None,
        group_id: int | None = None,
        venue_id: int | None = None,
    ) -> tuple[list[tuple[MatchORM, TeamORM, TeamORM]], int]:
        HomeTeam = aliased(TeamORM)
        AwayTeam = aliased(TeamORM)
        query = (
            self.session.query(MatchORM, HomeTeam, AwayTeam)
            .join(HomeTeam, MatchORM.home_team_id == HomeTeam.id)
            .join(AwayTeam, MatchORM.away_team_id == AwayTeam.id)
        )
        if team_id is not None:
            query = query.filter(
                (MatchORM.home_team_id == team_id) | (MatchORM.away_team_id == team_id)
            )
        if stage_id is not None:
            query = query.filter(MatchORM.stage_id == stage_id)
        if group_id is not None:
            query = query.filter(MatchORM.group_id == group_id)
        if venue_id is not None:
            query = query.filter(MatchORM.venue_id == venue_id)
        total = query.count()
        items = query.order_by(MatchORM.date.desc()).offset(offset).limit(limit).all()
        return items, total
