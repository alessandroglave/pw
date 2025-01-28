from app.database.models import Reservation, User
from app.exceptions import not_authorized_exception
from app.helpers.BackofficeHelper import isManager


def can_view_reservations(logged_user: User):
    if not isManager(logged_user):
        raise not_authorized_exception()


def can_manage_reservations(logged_user: User):
    if not isManager(logged_user):
        raise not_authorized_exception()


def can_view_reservation(logged_user: User, reservation: Reservation):
    if not (__is_reservation_owner(logged_user, reservation) or isManager(logged_user)):
        raise not_authorized_exception()


def can_edit_reservation(logged_user: User, reservation: Reservation):
    return can_view_reservation(logged_user, reservation)


def __is_reservation_owner(logged_user: User, reservation: Reservation):
    return reservation.guest.user_id == logged_user.id
