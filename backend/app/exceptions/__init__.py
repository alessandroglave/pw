from fastapi import HTTPException, status


def access_token_expired_exception():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )


def credentials_exception():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credentials not valid",
        headers={"WWW-Authenticate": "Bearer"},
    )


def email_exists_exception(email: str):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"A user with email {email} already exists",
    )


def room_not_bookable_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Room is not bookable on provided dates",
    )


def room_has_not_enough_capacity_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Room has not enough capacity",
    )


def room_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Room not found",
    )


def reservation_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Reservation not found",
    )


def reservation_deletion_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Reservation was not deleted",
    )


def room_deletion_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Room was not deleted",
    )


def not_authorized_exception():
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You're not authorized",
    )


def closing_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Closing not found",
    )


def user_not_found_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="User not found",
    )


def concurrent_exception():
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Failed to acquire the lock.",
    )
