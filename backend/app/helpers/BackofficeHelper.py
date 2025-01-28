from app.constants import Roles
from app.database.models import User


def isManager(user: User):
    return user.role.name in {Roles.STAFF, Roles.ADMIN}
