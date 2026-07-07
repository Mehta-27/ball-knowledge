from orm.stage import StageORM
from schemas.stage import StageResponse, StageDetailResponse


def stage_orm_to_response(stage: StageORM) -> StageResponse:
    return StageResponse(
        id=stage.id,
        name=stage.name,
        type=stage.type,
        order=stage.order,
    )


def stage_orm_to_detail(stage: StageORM) -> StageDetailResponse:
    return StageDetailResponse(
        id=stage.id,
        name=stage.name,
        type=stage.type,
        order=stage.order,
        season_id=stage.season_id,
        start_date=stage.start_date,
        end_date=stage.end_date,
    )
