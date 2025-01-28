from fastapi import Depends

from app.repositories.role_repository import RoleRepository


class RoleService:
    _repository: RoleRepository

    def __init__(self, role_repository: RoleRepository = Depends()) -> None:
        self._repository = role_repository

    def get_by_id(self, id: int):
        return self._repository.get_by_id(id)

    def get_by_name(self, name: str):
        return self._repository.get_by_name(name)

    def create(self, name: str):
        return self._repository.create(name)
