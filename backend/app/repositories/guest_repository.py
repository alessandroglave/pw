from fastapi import Depends
from sqlalchemy.orm import Session

from app.configs.Database import get_db
from app.database.models import Guest
from app.schemas.guest_schema import GuestCreateInput


class GuestRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    def get_by_id(self, id: int):
        query = self.db.query(Guest).where(Guest.id == id)
        return query.first()

    def get_ids_from_user_id(self, user_id: int):
        query = self.db.query(Guest.id).where(Guest.user_id == user_id)
        return [result[0] for result in query.all()]

    def create(self, input: GuestCreateInput):
        data = Guest(user_id=input.user_id, personal_info_id=input.personal_info_id)
        self.db.add(data)
        self.db.commit()
        self.db.refresh(data)
        return data
