from orm.group import GroupORM
from orm.stage import StageORM
from schemas.group import GroupResponse, GroupDetailResponse


def group_orm_to_response(group: GroupORM) -> GroupResponse:
    return GroupResponse(
        id=group.id,
        name=group.name,
        stage_id=group.stage_id,
    )


def group_orm_to_detail(group: GroupORM, stage: StageORM) -> GroupDetailResponse:
    return GroupDetailResponse(
        id=group.id,
        name=group.name,
        stage_id=group.stage_id,
        stage_name=stage.name,
    )
