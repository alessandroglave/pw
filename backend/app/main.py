from typing import Annotated
from fastapi import Depends, FastAPI

from app.configs.Cors import setup_cors
from app.configs.DatabaseMigrations import run_migrations
from app.configs.Environment import get_environment_variables
from app.configs.Router import load_routers

envs = get_environment_variables()

# Initializing FastAPI server
app = FastAPI(
    title=envs.APP_NAME,
    version=envs.APP_VERSION,
)

# Adds CORS middleware to FastAPI application
setup_cors(app)

# Loads application routers
load_routers(app)

 
# on startup, runs migration through alembic
@app.on_event("startup")
def startup_event():
    run_migrations()
