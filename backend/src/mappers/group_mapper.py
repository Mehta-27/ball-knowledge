from models.group import Group
from orm.group import GroupORM


def group_to_orm(group: Group) -> GroupORM:
    return GroupORM(
        id=group.id,
        stage_id=group.stage_id,
        name=group.name,
    )
