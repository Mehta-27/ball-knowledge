from sqlalchemy.orm import Session
from orm.stage import StageORM


class StageRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert_all(self, stages: list[StageORM]):
        try:
            for stage in stages:
                existing_stage = self.session.get(StageORM, stage.id)
                if existing_stage is None:
                    self.session.add(stage)
                else:
                    existing_stage.name = stage.name
                    existing_stage.type = stage.type
                    existing_stage.order = stage.order
                    existing_stage.start_date = stage.start_date
                    existing_stage.end_date = stage.end_date
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def get_all(self) -> list[StageORM]:
        return self.session.query(StageORM).order_by(StageORM.order).all()

    def get_by_id(self, stage_id: int) -> StageORM | None:
        return self.session.get(StageORM, stage_id)
