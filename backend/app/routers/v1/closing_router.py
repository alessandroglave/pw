from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.manager_dep import ManagerDep
from app.exceptions import closing_not_found_exception
from app.helpers import DateHelper
from app.schemas.closing_schema import CreateClosingInput
from app.services.closing_service import ClosingService
from app.validators import CommonValidator

# router definition
router = APIRouter(prefix="/closings", tags=["closings"])


# Setup local dependency injection
# Docs: https://fastapi.tiangolo.com/tutorial/dependencies/
async def service_dep(closing_service: ClosingService = Depends()) -> ClosingService:
    return closing_service


ClosingServiceDep = Annotated[ClosingService, Depends(service_dep)]


# Restricted route to retrieve all closings starting from a provided date
@router.get("/", status_code=200)
def get_all_from_date(manager: ManagerDep, service: ClosingServiceDep, from_date: str):
    start_date = DateHelper.parse_date(from_date)

    return {"model": "Closing", "data": service.get_all_from_date(start_date)}


# Restricted route to create a closing
@router.post("/", status_code=201)
def create(
    manager: ManagerDep, service: ClosingServiceDep, payload: CreateClosingInput
):
    start, end = DateHelper.parse_dates(payload.from_date, payload.to_date)
    CommonValidator.check_dates(start, end, True)

    record = service.create(start, end, payload.reason)

    return {"model": "Closing", "data": record}


# Restricted route to delete a single closing
@router.delete("/{id}", status_code=200)
def delete(manager: ManagerDep, service: ClosingServiceDep, id: int):
    closing = service.get_by_id(id)

    if closing is None:
        raise closing_not_found_exception()

    is_deleted = service.delete(closing)

    return {"model": "Closing", "data": {"id": id, "deleted": is_deleted}}
