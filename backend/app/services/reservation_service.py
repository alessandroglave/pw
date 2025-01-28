from datetime import datetime

from fastapi import Depends

from app.database.models import Reservation, Room
from app.repositories.reservation_repository import ReservationRepository
from app.services.guest_service import GuestService


class ReservationService:
    _repository: ReservationRepository
    _guest_service: GuestService

    def __init__(
        self,
        reservation_repository: ReservationRepository = Depends(),
        guest_service: GuestService = Depends(),
    ) -> None:
        self._repository = reservation_repository
        self._guest_service = guest_service

    def get_user_reservations(self, user_id: int):
        # retrieves all user's associated guest_id
        guest_ids = self._guest_service.get_ids_from_user_id(user_id)
        if not guest_ids:
            return []
        # search user's reservations using it's guest_ids
        return self._repository.get_user_reservations(guest_ids)

    def get_active_reservations(self, day: datetime):
        return self._repository.get_active_reservations(day)

    def get_by_id(self, id: int):
        return self._repository.get_by_id(id)

    def delete(self, reservation: Reservation):
        return self._repository.delete(reservation)

    def create(
        self,
        guest_id: int,
        room: Room,
        start: datetime,
        end: datetime,
        persons: int,
    ):
        return self._repository.create(guest_id, room, start, end, persons)

    def edit(
        self,
        reservation: Reservation,
        room: Room,
        start: datetime,
        end: datetime,
        persons: int,
    ):
        return self._repository.edit(reservation, room, start, end, persons)
