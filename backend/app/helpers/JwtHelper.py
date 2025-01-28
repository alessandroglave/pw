from typing import Dict

from jose import jwt

from app.configs.Environment import get_environment_variables

envs = get_environment_variables()


def create(data: Dict[str, any]):
    return jwt.encode(data, key=envs.JWT_SECRET_KEY, algorithm=envs.JWT_ALG)


def decode(str: str):
    return jwt.decode(str, key=envs.JWT_SECRET_KEY, algorithms=envs.JWT_ALG)
