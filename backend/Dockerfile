FROM python:3.9.2
EXPOSE 8000
WORKDIR /app

COPY requirements.txt /app/requirements.txt
COPY alembic.ini /app/alembic.ini

COPY ./app /app/app
COPY ./migrations /app/migrations

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]