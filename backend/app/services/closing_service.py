from datetime import datetime
from typing import Union

from fastapi import Depends

from app.database.models import Closing
from app.repositories.closing_repository import ClosingRepository


class ClosingService:
    _repository: ClosingRepository

    def __init__(self, closing_repository: ClosingRepository = Depends()) -> None:
        self._repository = closing_repository

    def get_all_from_date(self, from_date: datetime):
        return self._repository.get_all_from_date(from_date)

    def get_by_id(self, id: int):
        return self._repository.get_by_id(id)

    def create(self, from_date: datetime, to_date: datetime, reason: Union[str, None]):
        return self._repository.create(from_date, to_date, reason)

    def delete(self, closing: Closing):
        return self._repository.delete(closing)
