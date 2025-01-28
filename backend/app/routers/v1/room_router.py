from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.manager_dep import ManagerDep
from app.exceptions import room_deletion_exception, room_not_found_exception
from app.helpers import DateHelper
from app.schemas.room_schema import CreateRoomPayload
from app.services.room_service import RoomService
from app.validators import CommonValidator

# router definition
router = APIRouter(prefix="/rooms", tags=["rooms"])


# Setup local dependency injection
# Docs: https://fastapi.tiangolo.com/tutorial/dependencies/
async def service_dep(user_service: RoomService = Depends()) -> RoomService:
    return user_service


RoomServiceDep = Annotated[RoomService, Depends(service_dep)]


# Public route to get all rooms informations
@router.get("/")
def index(room_service: RoomServiceDep):
    return {"model": "Room", "data": [room for room in room_service.all()]}


# Route to create a room. Its use is restricted to managers.
@router.post("/")
def create(
    # defining the CreateRoomPayload as Pydantic class,
    # payload variable is validated automatically by Pydantic,
    # that raises an exception if user input is not valid
    payload: CreateRoomPayload,
    room_service: RoomServiceDep,
    manager: ManagerDep,
):
    """
    ManagerDep has logged user data if user has role `admin` or `staff`.
    If not, ManagerDep acts as a middleware, raising an exception.
    So, in that case the following code is not reachable.
    """
    room = room_service.create(payload)
    return {"model": "Room", "data": room}


# Public route to check all available rooms for reservation
# from_date, to_date and persons are query parameters, eg. /available-rooms?from_date....
@router.get("/available-rooms")
def available_rooms(
    from_date: str, to_date: str, persons: int, room_service: RoomServiceDep
):
    """
    Using DateHelper to centralize date parsing and validation.
    If the date is not in YYYY-MM-DD format it raises an exception.
    """
    start, end = DateHelper.parse_dates(from_date, to_date)
    """
    Validate provided dates. 
    It raises an exception if dates are not sequential.
    """
    CommonValidator.check_dates(start, end)

    return {
        "model": "Room",
        "data": room_service.list_available_rooms(start, end, persons),
    }


# Public route to get single room data by its ID
@router.get("/{id}")
def room(
    id: int,
    room_service: RoomServiceDep,
):
    room = room_service.get_by_id(id)
    if room is None:
        raise room_not_found_exception()
    return {"model": "Room", "data": room}


# Route to delete a room. Its use is restricted to managers.
@router.delete("/{id}")
def delete(id: int, room_service: RoomServiceDep, manager: ManagerDep):
    room = room_service.get_by_id(id)
    if room is None:
        raise room_not_found_exception()

    deletion = room_service.delete(room)
    if deletion is False:
        raise room_deletion_exception()

    return {"model": "Room", "data": {"id": id, "deleted": True}}
