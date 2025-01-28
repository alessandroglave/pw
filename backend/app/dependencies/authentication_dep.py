from typing import Annotated

from app.configs.Authentication import oauth2_scheme
from app.database.models import User
from app.services.user_service import UserService
from fastapi import Depends

"""
Authentication Dependency.
It checks user token, raising an exception if not found or not valid.
It returns user informations.
"""


async def authentication_dep(
    token: Annotated[str, Depends(oauth2_scheme)], user_service: UserService = Depends()
):
    user = user_service.get_user_from_token(token)
    return user


AuthenticationDep = Annotated[User, Depends(authentication_dep)]
