from fastapi import HTTPException

__all__ = ["UserNotFoundError","credentials_exception"]


class UserNotFoundError(Exception):
    pass
class DocumentNotFoundError(Exception):
    pass
class ChatNotFound(Exception):
    pass
class SummaryNotFound(Exception):
    pass
credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )
