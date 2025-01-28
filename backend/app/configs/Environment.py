from functools import lru_cache
from typing import Union

from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvironmentConfig(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    DB_CONNECTION: str
    DB_HOSTNAME: str
    MYSQL_PORT: str
    MYSQL_DATABASE: str
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    JWT_SECRET_KEY: str
    JWT_ALG: str
    CREATE_STAFF_KEY: str
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_AUTH: Union[str, None]
    REDIS_DB: Union[int, None]

    """ 
        Pydantic configuration
        Environmentals variables have always priority over variables loaded in .env files
    """
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


# @lru_cache is used to cache the result of this function.
# This way, environmental variables are read only once.
@lru_cache
def get_environment_variables():
    return EnvironmentConfig()
