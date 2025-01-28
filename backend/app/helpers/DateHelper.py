from datetime import datetime

from fastapi import HTTPException


def parse_dates(from_date: str, to_date: str):
    return parse_date(from_date), parse_date(to_date)


def parse_date(date: str):
    try:
        return datetime.strptime(date, "%Y-%m-%d")

    except ValueError:
        raise HTTPException(
            status_code=400, detail="Invalid date format. Use YYYY-MM-DD."
        )
