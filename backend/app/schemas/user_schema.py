from typing import Union

from pydantic import BaseModel, EmailStr


class UserSignupInput(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone_number: Union[str, int]


class UserCreateInput(BaseModel):
    email: str
    password: str


class StaffSignupInput(UserSignupInput):
    type: str
    key: str


class UserSignInInput(BaseModel):
    email: str
    password: str


class UserResetPasswordInput(BaseModel):
    email: str
