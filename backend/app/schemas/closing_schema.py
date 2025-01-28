from typing import Optional

from pydantic import BaseModel


class CreateClosingInput(BaseModel):
    from_date: str
    to_date: str
    reason: Optional[str] = None
