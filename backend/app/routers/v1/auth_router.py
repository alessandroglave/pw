from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.constants import Roles
from app.dependencies.authentication_dep import AuthenticationDep
from app.exceptions import (
    credentials_exception,
    email_exists_exception,
    user_not_found_exception,
)
from app.schemas.user_schema import (
    StaffSignupInput,
    UserResetPasswordInput,
    UserSignInInput,
    UserSignupInput,
)
from app.services.email_service import EmailService
from app.services.role_service import RoleService
from app.services.user_service import UserService
from app.validators import BackofficeValidator

# router definition
router = APIRouter(prefix="/auth", tags=["auth"])


# Setup local dependency injection
# Docs: https://fastapi.tiangolo.com/tutorial/dependencies/
async def service_dep(user_service: UserService = Depends()) -> UserService:
    return user_service


UserServiceDep = Annotated[UserService, Depends(service_dep)]


# Public route to let users to signup
@router.post("/signup", status_code=201)
def signup(
    # defining the UserSignupInput as Pydantic class,
    # payload variable is validated automatically by Pydantic,
    # that raises an exception if user input is not valid
    payload: UserSignupInput,
    user_service: UserServiceDep,
    role_service: RoleService = Depends(),
):
    if user_service.get_by_email(payload.email):
        raise email_exists_exception(payload.email)

    customer_role = role_service.get_by_name(Roles.CUSTOMER)
    if not customer_role:
        customer_role = role_service.create(Roles.CUSTOMER)

    user = user_service.create(payload, customer_role)

    return {"model": "User", "data": user}


# Public route to let users to reset their password.
# Simple password reset: it creates a new password and sends it to the provided email
@router.post("/reset-password", status_code=200)
def reset_password(
    payload: UserResetPasswordInput,
    user_service: UserServiceDep,
):
    user = user_service.get_by_email(payload.email)
    if not user:
        raise user_not_found_exception()

    # creates a random password
    new_password = user_service.create_password()

    # logs password on console (for development purpose)
    print("new password:" + new_password)

    # updates user's password on database
    user_service.reset_password(user, new_password)

    # sends new password to the user
    EmailService().send_email(
        user.email,
        "Password resettata",
        "Come richiesto, la tua password è stata resettata. Utilizza la seguente password per accedere al tuo account: "
        + new_password,
    )
    return {"model": "User", "data": {"success": True}}


# Public route to let users to signin
# It returns an access_token to be used
# as Bearer token with the Authorization Header
@router.post("/token", status_code=200)
def signin(
    # defining the UserSignupInput as Pydantic class,
    # payload variable is validated automatically by Pydantic,
    # that raises an exception if user input is not valid
    payload: UserSignInInput,
    user_service: UserServiceDep,
):
    user = user_service.authenticate(payload)

    if not user:
        raise credentials_exception()

    token = user_service.build_token(user)
    return {"data": {"access_token": token}}


# Route used to retrieve current logged user informations
@router.get("/me", status_code=200)
def get_logged_user(logged_user: AuthenticationDep):
    return {"model": "User", "data": logged_user}


# Restricted route to create users with `admin` or `staff` role
@router.post("/create-staff-member", status_code=201)
def createStaffMember(
    payload: StaffSignupInput,
    user_service: UserServiceDep,
    role_service: RoleService = Depends(),
):
    BackofficeValidator.can_create_staff_members(payload)

    if user_service.get_by_email(payload.email):
        raise email_exists_exception(payload.email)

    role = role_service.get_by_name(
        Roles.ADMIN if payload.type == "admin" else Roles.STAFF
    )
    if not role:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role not found",
        )

    user = user_service.create(payload, role)
    return {"model": "User", "data": user}
