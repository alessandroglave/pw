from alembic import command
from alembic.config import Config


# Function used to run migration through alembic package
def run_migrations():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
