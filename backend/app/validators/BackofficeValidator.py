from app.configs.Environment import get_environment_variables
from app.exceptions import not_authorized_exception
from app.schemas.user_schema import UserSignupInput

envs = get_environment_variables()


# Checks if body contains a `key` property and if it's
# equal to the CREATE_STAFF_KEY env variable value
def can_create_staff_members(user_input: UserSignupInput):
    if user_input.key != envs.CREATE_STAFF_KEY:
        raise not_authorized_exception()
