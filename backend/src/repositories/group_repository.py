from sqlalchemy.orm import Session
from orm.group import GroupORM


class GroupRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert_all(self, groups: list[GroupORM]):
        try:
            for group in groups:
                existing_group = self.session.get(GroupORM, group.id)
                if existing_group is None:
                    self.session.add(group)
                else:
                    existing_group.stage_id = group.stage_id
                    existing_group.name = group.name
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def get_all(self) -> list[GroupORM]:
        return self.session.query(GroupORM).all()

    def get_by_id(self, group_id: int) -> GroupORM | None:
        return self.session.get(GroupORM, group_id)

    def get_by_name(self, name: str) -> GroupORM | None:
        return self.session.query(GroupORM).filter(GroupORM.name == name).first()
