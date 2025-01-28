from pydantic import BaseModel

from app.schemas.personal_info_schema import PersonalInfoCreateInput


class CreateReservationInput(BaseModel):
    room_id: int
    from_date: str
    to_date: str
    persons: int


class CreateReservationAdminInput(PersonalInfoCreateInput):
    room_id: int
    from_date: str
    to_date: str
    persons: int


class EditReservationInput(BaseModel):
    room_id: int
    from_date: str
    to_date: str
    persons: int
