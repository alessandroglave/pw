from datetime import datetime
from typing import List

from fastapi import Depends
from sqlalchemy import and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.configs.Database import get_db
from app.database.models import Guest, Reservation, Room


class ReservationRepository:
    db: Session

    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    def get_user_reservations(self, guest_ids: List[int]):
        query = (
            self.db.query(Reservation)
            .where(
                Reservation.guest_id.in_(guest_ids),
                Reservation.deleted_at.is_(None),
            )
            .options(
                joinedload(Reservation.guest).joinedload(Guest.personal_info),
                joinedload(Reservation.room),
            )
        )
        return query.all()

    # retrieves active reservations on a provided day
    def get_active_reservations(self, day: datetime):
        """
        The following query is translated into SQLAlchemy below:
        SELECT
            * from reservations r
        WHERE
            r.deleted_at IS NULL
            AND (
                r.check_in_date == ?
                OR (
                    r.check_in_date < ?
                    AND r.check_out_date >= ?
                )
            );
        The WHERE "AND" condition is used to retrieve
        - all reservations with check in on the provided day
        - OR all reservations started before that day, that will end from that day or in the future
        """
        query = (
            self.db.query(Reservation)
            .where(
                Reservation.deleted_at.is_(None),
                or_(
                    Reservation.check_in_date == day,
                    and_(
                        Reservation.check_in_date < day,
                        Reservation.check_out_date >= day,
                    ),
                ),
            )
            .options(
                joinedload(Reservation.guest).joinedload(Guest.personal_info),
                joinedload(Reservation.room),
            )
        )
        return query.all()

    def get_by_id(self, id: int):
        query = (
            self.db.query(Reservation)
            .where(Reservation.id == id, Reservation.deleted_at.is_(None))
            .options(
                joinedload(Reservation.guest).joinedload(Guest.personal_info),
                joinedload(Reservation.room),
            )
        )
        return query.first()

    def create(
        self,
        guest_id: int,
        room: Room,
        from_date: datetime,
        to_date: datetime,
        persons: int,
    ):
        try:
            reservation = Reservation(
                guest_id=guest_id,
                room_id=room.id,
                check_in_date=from_date,
                check_out_date=to_date,
                persons=persons,
                total_cost=room.price_per_night * (to_date - from_date).days,
            )
            self.db.add(reservation)
            self.db.commit()
            self.db.refresh(reservation)

            return self.get_by_id(reservation.id)

        except IntegrityError as e:
            print(e)
            self.db.rollback()
            return None

    def edit(
        self,
        reservation: Reservation,
        room: Room,
        from_date: datetime,
        to_date: datetime,
        persons: int,
    ):
        try:
            reservation.room_id = room.id
            reservation.check_in_date = from_date
            reservation.check_out_date = to_date
            reservation.persons = persons
            reservation.total_cost = room.price_per_night * (to_date - from_date).days

            self.db.commit()
            self.db.refresh(reservation)

            return self.get_by_id(reservation.id)

        except IntegrityError as e:
            print(e)
            self.db.rollback()
            return None

    def delete(self, reservation: Reservation):
        reservation.deleted_at = datetime.now()
        self.db.commit()
        self.db.refresh(reservation)
        return reservation.deleted_at is not None
