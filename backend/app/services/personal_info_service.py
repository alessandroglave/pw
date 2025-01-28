from fastapi import Depends

from app.repositories.personal_info_repository import PersonalInfoRepository
from app.schemas.personal_info_schema import PersonalInfoCreateInput


class PersonalInfoService:
    _repository: PersonalInfoRepository

    def __init__(
        self, personal_info_repository: PersonalInfoRepository = Depends()
    ) -> None:
        self._repository = personal_info_repository

    def get_by_id(self, id: int):
        return self._repository.get_by_id(id)

    def create(self, input: PersonalInfoCreateInput):
        return self._repository.create(input)
