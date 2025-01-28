from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, scoped_session, sessionmaker

from app.configs.Environment import get_environment_variables

envs = get_environment_variables()


database_url = f"mysql+pymysql://{envs.MYSQL_USER}:{envs.MYSQL_PASSWORD}@{envs.DB_HOSTNAME}:{envs.MYSQL_PORT}/{envs.MYSQL_DATABASE}?charset=utf8mb4&collation=utf8mb4_general_ci"

engine = create_engine(database_url, echo=True, pool_size=50, max_overflow=50)
session_factory = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


# Used to retrieve a database connection with SQLAlchemy
def get_db():
    db = scoped_session(session_factory)
    try:
        yield db
    finally:
        db.close()
