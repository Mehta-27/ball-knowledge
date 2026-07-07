from models.stage import Stage
from orm.stage import StageORM


def stage_to_orm(stage: Stage) -> StageORM:
    return StageORM(
        id=stage.id,
        season_id=stage.season_id,
        name=stage.name,
        type=stage.type,
        order=stage.order,
        start_date=stage.start_date.isoformat() if stage.start_date else None,
        end_date=stage.end_date.isoformat() if stage.end_date else None,
    )
