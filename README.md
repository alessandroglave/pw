# Project Work: Hotel booking system

- Backend API: `FastAPI`
- Frontend: `NextJS`

## Deploy

You can use **Docker Compose** to locally deploy the software system built with the `docker-compose up -d` command, appropriately customizing the environment variables within it.

The following containers will be created:

- `MySQL` database with the respective Docker `volume` for data persistence;
- `Redis`;
- `backend` (using the `Dockerfile` found in the `/backend` folder of the repository root);
- `frontend` (using the `Dockerfile` present in the `/frontend` folder of the repository root).

## Database: structure and initial data

`alembic` is used for migration management on the backend, making sure that any migrations not yet performed are automatically applied when the FastAPI server starts up.

There is a single migration with the purpose of creating all database tables and entering the initial data used in the project, such as user roles and rooms available for reservations.

In the root of the `backend` project, however, there is a `SQL.sql` file containing a dump of the structure and data of the realized database, analogous to the contents of the migration in `/backend/migrations/versions/2025_01_24_170508_first_migration.py`.

## Testing the backend API with Postman

It's possible to use **Postman** for testing the backend API by importing the files (collection and environment) in `Postman exports` folder.

Customize LOCAL environment's `BE_URL` and `CREATE_STAFF_KEY` accordingly to your local backend environmental variables values.

It will be necessary, using Postman, to create a user with an admin or staff role in order to test the restricted `backoffice` area on the frontend or on the Postman collection.

On Postman `sign-ins` requests, there is a post-request script that updates the variable BEARER_TOKEN with the value obtained from the server response.

Once the request is made, subsequent requests will be made with the user's token as Bearer Token into the Authorization Header.
