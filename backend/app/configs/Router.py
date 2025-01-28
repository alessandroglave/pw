from app.configs.API import base_api_prefix
from app.routers.v1 import auth_router, closing_router, reservation_router, room_router


# Function used to load all routers defined in `/app/routers/v1`,
# applying a prefix to their route definitions
def load_routers(app):
    app.include_router(room_router.router, prefix=base_api_prefix)
    app.include_router(auth_router.router, prefix=base_api_prefix)
    app.include_router(reservation_router.router, prefix=base_api_prefix)
    app.include_router(closing_router.router, prefix=base_api_prefix)
