from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.configs.Database import Base


# SQLAlchemy model definitions
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)

    users = relationship("User", back_populates="role")


class PersonalInfo(Base):
    __tablename__ = "personal_infos"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
    deleted_at = Column(DateTime, nullable=True, default=None)

    users = relationship("User", back_populates="personal_info")
    guests = relationship("Guest", back_populates="personal_info")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
    deleted_at = Column(DateTime, nullable=True, default=None)

    role_id = Column(ForeignKey("roles.id"), nullable=False)
    role = relationship("Role", back_populates="users")

    personal_info_id = Column(ForeignKey("personal_infos.id"), nullable=False)
    personal_info = relationship("PersonalInfo", back_populates="users")

    guests = relationship("Guest", back_populates="user")


class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="guests")

    personal_info_id = Column(ForeignKey("personal_infos.id"), nullable=False)
    personal_info = relationship("PersonalInfo", back_populates="guests")

    reservations = relationship("Reservation", back_populates="guest")


class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_number = Column(Integer, nullable=False, unique=True)
    name = Column(String(50), nullable=False)
    room_type = Column(String(50), nullable=False)
    price_per_night = Column(Float, nullable=False)
    capacity = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    deleted_at = Column(DateTime, nullable=True, default=None)

    reservations = relationship("Reservation", back_populates="room")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    total_cost = Column(Float, nullable=False)
    notes = Column(String(255), nullable=True)
    persons = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )
    deleted_at = Column(DateTime, nullable=True, default=None)

    guest_id = Column(ForeignKey("guests.id"), nullable=False)
    guest = relationship("Guest", back_populates="reservations")

    room_id = Column(ForeignKey("rooms.id"), nullable=False)
    room = relationship("Room", back_populates="reservations")


class Closing(Base):
    __tablename__ = "closings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    reason = Column(String(255), nullable=True)
