# Project Work - Backend API

Python [FastAPI](https://fastapi.tiangolo.com) project.

This project uses **python v3.9.2**. and requires a **MySQL** database and a **Redis** database.

## Setup

- Create virtual environment: `python -m venv .venv`
- Activate virtual environment: `source .venv/bin/activate`
- Upgrade pip: `python -m pip install --upgrade pip`
- Install dependencies: `pip install -r requirements.txt`
- Create .env file copying .env.example `cp .env.example .env`, customizing variables values with your settings;
- Run server in development mode: `fastapi dev ./app/main.py`
  or
- Run server in production mode: `fastapi run ./app/main.py`
- Once finished, deactivate the virtual environment: `deactivate`

## Development

The entrypoint of the application is `/app/main.py` file.
