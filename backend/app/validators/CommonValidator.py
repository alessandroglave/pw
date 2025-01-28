from datetime import datetime

from fastapi import HTTPException


def check_dates(from_date: datetime, to_date: datetime, allow_same_day=False):
    today = datetime.now()

    if from_date.date() < today.date():
        raise HTTPException(
            status_code=400,
            detail="Start date cannot be in the past.",
        )

    if allow_same_day:
        if from_date.date() > to_date.date():
            raise HTTPException(
                status_code=400,
                detail="Start date must be before or equal the end date.",
            )
    else:
        if from_date.date() >= to_date.date():
            raise HTTPException(
                status_code=400, detail="Start date must be before the end date."
            )
