from fastapi import Depends
from sqlalchemy.orm import Session, joinedload

from app.configs.Database import get_db
from app.database.models import PersonalInfo, Role, User
from app.schemas.user_schema import UserCreateInput


class UserRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    def get_by_id(self, id: int):
        query = (
            self.db.query(User)
            .where(User.id == id, User.deleted_at.is_(None))
            .options(joinedload(User.role), joinedload(User.personal_info))
        )
        return query.first()

    def get_by_email(self, email: str):
        query = (
            self.db.query(User)
            .where(
                User.email == email,
                User.deleted_at.is_(None),
            )
            .options(joinedload(User.role), joinedload(User.personal_info))
        )
        return query.first()

    def create(
        self, user_input: UserCreateInput, role: Role, personal_info: PersonalInfo
    ):
        user = User(
            email=user_input.email,
            password=user_input.password,
            role=role,
            personal_info=personal_info,
        )
        self.db.add(user)
        self.db.commit()
        return self.get_by_email(user.email)

    def reset_password(self, user: User, new_password: str):
        user.password = new_password
        self.db.commit()
        self.db.refresh(user)
        return True
