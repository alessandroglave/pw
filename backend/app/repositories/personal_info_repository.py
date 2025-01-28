from fastapi import Depends
from sqlalchemy.orm import Session

from app.configs.Database import get_db
from app.database.models import PersonalInfo
from app.schemas.personal_info_schema import PersonalInfoCreateInput


class PersonalInfoRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    def get_by_id(self, id: int):
        query = self.db.query(PersonalInfo).where(PersonalInfo.id == id)
        return query.first()

    def create(self, input: PersonalInfoCreateInput):
        data = PersonalInfo(
            first_name=input.first_name,
            last_name=input.last_name,
            email=input.email,
            phone_number=input.phone_number,
        )
        self.db.add(data)
        self.db.commit()
        self.db.refresh(data)
        return data
