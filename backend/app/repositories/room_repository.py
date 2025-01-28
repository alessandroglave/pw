from datetime import datetime

from fastapi import Depends
from sqlalchemy import and_, case, func, select
from sqlalchemy.orm import Session, aliased

from app.configs.Database import get_db
from app.database.models import Closing, Reservation, Room
from app.schemas.room_schema import CreateRoomPayload


class RoomRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    def create(self, payload: CreateRoomPayload):
        room = Room(
            name=payload.name,
            room_number=payload.room_number,
            room_type=payload.room_type,
            price_per_night=payload.price_per_night,
            capacity=payload.capacity,
        )
        self.db.add(room)
        self.db.commit()
        self.db.refresh(room)
        return room

    def delete(self, room: Room):
        room.deleted_at = datetime.now()
        self.db.commit()
        self.db.refresh(room)
        return room.deleted_at is not None

    def all(self):
        query = self.db.query(Room).where(Room.deleted_at.is_(None))
        return query.all()

    def get_by_id(self, id: int):
        query = select(Room).where(Room.id == id, Room.deleted_at.is_(None))
        room = self.db.execute(query).scalars().first()

        return room

    def list_available_rooms(
        self, from_date: datetime, to_date: datetime, persons: int
    ):
        """
        The `aliased` function is used by SQLAlchemy to refer to
        reservation and closings tables in the inner join statement
        """
        reservation_alias = aliased(Reservation)
        closing_alias = aliased(Closing)

        """
        The following query is translated into SQLAlchemy below:
        SELECT DISTINCT rooms.* 
        FROM rooms
        LEFT JOIN reservations 
            ON 
                rooms.id = reservations.room_id
                # This block is needed to avoid reservations for the provided room, whose time slots overlaps
                # with the provided from_date and to_date variables.
                AND reservations.check_in_date < ? # to_date
                AND reservations.check_out_date > ? # from_date
        LEFT JOIN closings
            ON
                # This block is needed to check if there are overlapping time slots 
                # with the provided from_date and to_date variables.
                closings.from_date <= ?
                AND closings.to_date >= ?
        WHERE
            # to check if room.capacity is enough
            rooms.capacity >= ? 
            # to avoid any overlaps
            AND reservations.id IS NULL 
            # to avoid any overlaps
            AND closings.id IS NULL 
            # to avoid soft-deleted rooms
            AND rooms.deleted_at is NULL 
        """
        query = (
            select(Room)
            .outerjoin(
                reservation_alias,
                and_(
                    Room.id == reservation_alias.room_id,
                    reservation_alias.check_in_date < to_date,
                    reservation_alias.check_out_date > from_date,
                    reservation_alias.deleted_at.is_(None),
                ),
            )
            .outerjoin(
                closing_alias,
                and_(
                    closing_alias.from_date <= to_date,
                    closing_alias.to_date >= from_date,
                ),
            )
            .where(
                Room.capacity >= persons,
                reservation_alias.id.is_(None),
                closing_alias.id.is_(None),
                Room.deleted_at.is_(None),
            )
        )

        available_rooms = self.db.execute(query).unique().scalars().all()

        return available_rooms

    def check_room_availability(
        self, room_id: int, from_date: datetime, to_date: datetime
    ):
        query = (
            select(
                case(
                    (func.count(Reservation.id) > 0, False),
                    (
                        func.count(Closing.id) > 0,
                        False,
                    ),
                    else_=True,
                ).label("is_bookable")
            )
            .select_from(Room)
            .outerjoin(
                Reservation,
                and_(
                    Room.id == Reservation.room_id,
                    Reservation.check_in_date < to_date,
                    Reservation.check_out_date > from_date,
                    Reservation.deleted_at.is_(None),
                ),
            )
            .outerjoin(
                Closing,
                and_(
                    Closing.from_date <= to_date,
                    Closing.to_date >= from_date,
                ),
            )
            .where(Room.id == room_id, Room.deleted_at.is_(None))
        )

        return self.db.execute(query).scalar()
