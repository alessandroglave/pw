from fastapi import Depends

from app.repositories.guest_repository import GuestRepository
from app.schemas.guest_schema import GuestCreateInput


class GuestService:
    _repository: GuestRepository

    def __init__(self, guest_repository: GuestRepository = Depends()) -> None:
        self._repository = guest_repository

    def get_by_id(self, id: int):
        return self._repository.get_by_id(id)

    def get_ids_from_user_id(self, user_id: int):
        return self._repository.get_ids_from_user_id(user_id)

    def create(self, input: GuestCreateInput):
        return self._repository.create(input)
