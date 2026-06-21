from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DocumentResponse(BaseModel):
    id: int
    original_name: str
    file_type: str
    file_size: int
    upload_date: datetime
    chat_id: Optional[int] = None

    class Config:
        from_attributes = True