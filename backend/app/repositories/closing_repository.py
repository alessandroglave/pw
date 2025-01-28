from datetime import datetime
from typing import Union

from fastapi import Depends
from sqlalchemy.orm import Session

from app.configs.Database import get_db
from app.database.models import Closing


class ClosingRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    def get_all_from_date(self, from_date: datetime):
        query = (
            self.db.query(Closing)
            .where(Closing.from_date >= from_date)
            .order_by(Closing.from_date.asc())
        )
        return query.all()

    def get_by_id(self, id: int):
        query = self.db.query(Closing).where(Closing.id == id)
        return query.first()

    def create(self, from_date: datetime, to_date: datetime, reason: Union[str, None]):
        record = Closing(from_date=from_date, to_date=to_date, reason=reason)
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def delete(self, closing: Closing):
        self.db.delete(closing)
        self.db.commit()
        return True
