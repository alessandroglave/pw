from fastapi import Depends

from sqlalchemy.orm import Session
from app.configs.Database import get_db
from app.database.models import Role


class RoleRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    def get_by_id(self, id: int):
        query = self.db.query(Role).where(Role.id == id)
        return query.first()

    def get_by_name(self, name: str):
        query = self.db.query(Role).where(Role.name == name)
        return query.first()
    
    def create(self, name: str):
        role = Role(name=name)
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)
        return role
