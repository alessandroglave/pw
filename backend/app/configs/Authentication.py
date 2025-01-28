from fastapi.security import OAuth2PasswordBearer

from app.configs.API import base_api_prefix
from app.configs.Environment import get_environment_variables

envs = get_environment_variables()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=base_api_prefix + "/auth/token")
