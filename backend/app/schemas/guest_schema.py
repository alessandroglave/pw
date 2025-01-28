from typing import Union

from pydantic import BaseModel


class GuestCreateInput(BaseModel):
    user_id: Union[None, int]
    personal_info_id: int
