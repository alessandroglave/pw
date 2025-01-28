from datetime import datetime

from fastapi import Depends

from app.database.models import Room
from app.repositories.room_repository import RoomRepository
from app.schemas.room_schema import CreateRoomPayload


class RoomService:
    _repository: RoomRepository

    def __init__(self, room_repository: RoomRepository = Depends()) -> None:
        self._repository = room_repository

    def create(self, payload: CreateRoomPayload):
        return self._repository.create(payload)

    def delete(self, room: Room):
        return self._repository.delete(room)

    def all(self):
        return self._repository.all()

    def get_by_id(self, id: int):
        return self._repository.get_by_id(id)

    def list_available_rooms(
        self, from_date: datetime, to_date: datetime, persons: int
    ):
        return self._repository.list_available_rooms(from_date, to_date, persons)

    def check_room_availability(
        self, room_id: int, from_date: datetime, to_date: datetime
    ):
        return self._repository.check_room_availability(room_id, from_date, to_date)
