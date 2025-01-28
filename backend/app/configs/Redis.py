import redis

from app.configs.Environment import get_environment_variables


# Singleton pattern
class Redis:
    _instance = None

    def __new__(cls):
        if not cls._instance:
            _envs = get_environment_variables()
            cls._instance = super().__new__(cls)
            cls._instance.conn = redis.StrictRedis(
                host=_envs.REDIS_HOST,
                port=_envs.REDIS_PORT,
                db=_envs.REDIS_DB,
                password=_envs.REDIS_AUTH if _envs.REDIS_AUTH else None,
            )

        return cls._instance.conn


# Function to retrieve Redis connection
def get_redis():
    return Redis()
