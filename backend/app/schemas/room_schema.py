from typing import Union

from pydantic import BaseModel


class CreateRoomPayload(BaseModel):
    price_per_night: float
    capacity: int
    name: Union[str, None]
    room_number: int
    room_type: Union[str, int]
