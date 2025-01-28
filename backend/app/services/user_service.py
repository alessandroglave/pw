import datetime
import secrets

from fastapi import Depends
from jose import ExpiredSignatureError, JWTError

from app.constants import (
    access_token_expire_minutes,
)
from app.database.models import Role, User
from app.exceptions import access_token_expired_exception, credentials_exception
from app.helpers import HashHelper, JwtHelper
from app.repositories.user_repository import UserRepository
from app.schemas.personal_info_schema import PersonalInfoCreateInput
from app.schemas.user_schema import UserCreateInput, UserSignupInput
from app.services.personal_info_service import PersonalInfoService


class UserService:
    _repository: UserRepository
    _personal_info_service: PersonalInfoService

    def __init__(
        self,
        user_repository: UserRepository = Depends(),
        personal_info_service: PersonalInfoService = Depends(),
    ) -> None:
        self._repository = user_repository
        self._personal_info_service = personal_info_service

    def get_by_id(self, id: int):
        return self._repository.get_by_id(id)

    def get_by_email(self, email: str):
        return self._repository.get_by_email(email)

    def create(self, user_input: UserSignupInput, role: Role):
        personal_info = self._personal_info_service.create(
            PersonalInfoCreateInput(
                first_name=user_input.first_name,
                last_name=user_input.last_name,
                email=user_input.email,
                phone_number=user_input.phone_number,
            )
        )

        return self._repository.create(
            UserCreateInput(
                email=user_input.email,
                password=HashHelper.hash(user_input.password),
            ),
            role,
            personal_info,
        )

    def create_password(self):
        # creates a random password of 16 characters
        return secrets.token_urlsafe(16)

    def reset_password(self, user: User, new_password: str):
        return self._repository.reset_password(user, HashHelper.hash(new_password))

    def authenticate(self, user_input: UserSignupInput):
        user = self.get_by_email(user_input.email)

        return (
            user
            if user
            and self.__verify_password(
                user_input.password, user.password.encode("utf-8")
            )
            else False
        )

    def __verify_password(self, hashed: str, plaintext: bytes):
        return HashHelper.verify(hashed, plaintext)

    def build_token(self, user: User):
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
            minutes=access_token_expire_minutes
        )
        jwt_data = {
            "email": user.email,
            "first_name": user.personal_info.first_name,
            "last_name": user.personal_info.last_name,
            "role": user.role.name,
            "exp": expire,
        }

        token = JwtHelper.create(jwt_data)

        return token

    def get_user_from_token(self, token: str):
        try:
            user_decoded = JwtHelper.decode(token)
        except ExpiredSignatureError:
            raise access_token_expired_exception()
        except JWTError:
            raise credentials_exception()

        email = user_decoded.get("email")
        if email is None:
            raise credentials_exception()

        user = self.get_by_email(email)
        if user is None:
            raise credentials_exception()
        return user
