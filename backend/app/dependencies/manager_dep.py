from typing import Annotated

from app.configs.Authentication import oauth2_scheme
from app.database.models import User
from app.exceptions import not_authorized_exception
from app.helpers.BackofficeHelper import isManager
from app.services.user_service import UserService
from fastapi import Depends

"""
Manager Dependency.
It checks user token, raising an exception if not found or not valid.
If user has not `admin` or `staff` role, it acts as a middleware, raising an exception.
If user is `admin` or `staff`, returns user informations.
"""


async def manager_dep(
    token: Annotated[str, Depends(oauth2_scheme)], user_service: UserService = Depends()
):
    user = user_service.get_user_from_token(token)
    if not isManager(user):
        raise not_authorized_exception()
    return user


ManagerDep = Annotated[User, Depends(manager_dep)]
