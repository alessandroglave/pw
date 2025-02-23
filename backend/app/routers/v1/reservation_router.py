from typing import Annotated

from fastapi import APIRouter, Depends

from app.constants import reservations_lock_name
from app.dependencies.authentication_dep import AuthenticationDep
from app.dependencies.manager_dep import ManagerDep
from app.exceptions import (
    reservation_deletion_exception,
    reservation_not_found_exception,
    room_has_not_enough_capacity_exception,
    room_not_bookable_exception,
    room_not_found_exception,
)
from app.helpers import DateHelper
from app.schemas.guest_schema import GuestCreateInput
from app.schemas.personal_info_schema import PersonalInfoCreateInput
from app.schemas.reservation_schema import (
    CreateReservationAdminInput,
    CreateReservationInput,
    EditReservationInput,
)
from app.services.guest_service import GuestService
from app.services.personal_info_service import PersonalInfoService
from app.services.reservation_service import ReservationService
from app.services.room_service import RoomService
from app.services.user_service import UserService
from app.sync.Mutex import Mutex
from app.validators import CommonValidator, ReservationValidator

# router definition
router = APIRouter(prefix="/reservations", tags=["reservations"])


# Setup local dependency injection
# Docs: https://fastapi.tiangolo.com/tutorial/dependencies/
async def service_dep(
    reservation_service: ReservationService = Depends(),
) -> UserService:
    return reservation_service


ReservationServiceDep = Annotated[ReservationService, Depends(service_dep)]


# Route to let users to create a reservation
@router.post("/", status_code=201)
def book(
    book_input: CreateReservationInput,
    reservation_service: ReservationServiceDep,
    room_service: Annotated[RoomService, Depends()],
    guest_service: Annotated[GuestService, Depends()],
    logged_user: AuthenticationDep,
):
    with Mutex(reservations_lock_name) as mutex:
        if mutex.lock:
            room = room_service.get_by_id(book_input.room_id)
            if room is None:
                raise room_not_found_exception()

            start, end = DateHelper.parse_dates(
                book_input.from_date, book_input.to_date
            )
            CommonValidator.check_dates(start, end)

            if room.capacity < book_input.persons:
                raise room_has_not_enough_capacity_exception()

            is_bookable = room_service.check_room_availability(room.id, start, end)
            if not is_bookable:
                raise room_not_bookable_exception()

            guest = guest_service.create(
                GuestCreateInput(
                    user_id=logged_user.id,
                    personal_info_id=logged_user.personal_info_id,
                )
            )

            reservation = reservation_service.create(
                guest.id, room, start, end, book_input.persons
            )
            return {"model": "Reservation", "data": reservation}


# Route to get user's reservations
@router.get("/my", status_code=200)
def get_user_reservations(
    reservation_service: ReservationServiceDep,
    logged_user: AuthenticationDep,
):
    reservations = reservation_service.get_user_reservations(logged_user.id)

    return {"model": "Reservation", "data": reservations}


# Restricted route, used by managers, to retrieve all reservations on a single day
@router.get("/day", status_code=200)
def get_by_day(
    day: str,
    reservation_service: ReservationServiceDep,
    manager: ManagerDep,
):
    ReservationValidator.can_view_reservations(manager)
    reservations = reservation_service.get_active_reservations(day)

    return {"model": "Reservation", "data": reservations}


# Restricted route: it creates a reservation with a guest not linked to a user account
@router.post("/guest", status_code=201)
def backofficeBooking(
    book_input: CreateReservationAdminInput,
    reservation_service: ReservationServiceDep,
    room_service: Annotated[RoomService, Depends()],
    guest_service: Annotated[GuestService, Depends()],
    personal_info_service: Annotated[PersonalInfoService, Depends()],
    manager: ManagerDep,
):
    with Mutex(reservations_lock_name) as mutex:
        if mutex.lock:
            room = room_service.get_by_id(book_input.room_id)
            if room is None:
                raise room_not_found_exception()

            start, end = DateHelper.parse_dates(
                book_input.from_date, book_input.to_date
            )
            CommonValidator.check_dates(start, end)

            if room.capacity < book_input.persons:
                raise room_has_not_enough_capacity_exception()

            is_bookable = room_service.check_room_availability(room.id, start, end)
            if not is_bookable:
                raise room_not_bookable_exception()

            personal_info = personal_info_service.create(
                PersonalInfoCreateInput(
                    first_name=book_input.first_name,
                    last_name=book_input.last_name,
                    email=book_input.email,
                    phone_number=book_input.phone_number,
                )
            )

            guest = guest_service.create(
                GuestCreateInput(
                    user_id=None,
                    personal_info_id=personal_info.id,
                )
            )

            reservation = reservation_service.create(
                guest.id, room, start, end, book_input.persons
            )
            return {"model": "Reservation", "data": reservation}


# Route to retrieve a single reservation data
@router.get("/{id}", status_code=200)
def get_by_id(
    id: int,
    reservation_service: ReservationServiceDep,
    logged_user: AuthenticationDep,
):
    reservation = reservation_service.get_by_id(id)
    if reservation is None:
        raise reservation_not_found_exception()

    # returns an error if user is neither the owner nor a manager
    ReservationValidator.can_view_reservation(logged_user, reservation)

    return {"model": "Reservation", "data": reservation}


# Route to let users or manager to edit a single reservation
@router.put("/{id}", status_code=200)
def edit(
    id: int,
    book_input: EditReservationInput,
    reservation_service: ReservationServiceDep,
    room_service: Annotated[RoomService, Depends()],
    logged_user: AuthenticationDep,
):
    with Mutex(reservations_lock_name) as mutex:
        if mutex.lock:
            room = room_service.get_by_id(book_input.room_id)
            if room is None:
                raise room_not_found_exception()

            reservation = reservation_service.get_by_id(id)
            if reservation is None:
                raise reservation_not_found_exception()

            start, end = DateHelper.parse_dates(
                book_input.from_date, book_input.to_date
            )
            CommonValidator.check_dates(start, end)

            ReservationValidator.can_edit_reservation(logged_user, reservation)

            if room.capacity < book_input.persons:
                raise room_has_not_enough_capacity_exception()

            is_bookable = room_service.check_room_availability(room.id, start, end)
            if not is_bookable:
                raise room_not_bookable_exception()

            reservation = reservation_service.edit(
                reservation, room, start, end, book_input.persons
            )
            return {"model": "Reservation", "data": reservation}


# Route to let users or managers to delete a single reservation
@router.delete("/{id}", status_code=200)
def delete_reservation(
    id: int,
    reservation_service: ReservationServiceDep,
    logged_user: AuthenticationDep,
):
    reservation = reservation_service.get_by_id(id)
    if reservation is None:
        raise reservation_not_found_exception()

    ReservationValidator.can_edit_reservation(logged_user, reservation)

    deletion = reservation_service.delete(reservation)
    if deletion is False:
        raise reservation_deletion_exception()

    return {"model": "Reservation", "data": {"id": id, "deleted": True}}
