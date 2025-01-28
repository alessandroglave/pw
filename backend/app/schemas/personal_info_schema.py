from typing import Union

from pydantic import BaseModel, EmailStr


class PersonalInfoCreateInput(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Union[str, int]
