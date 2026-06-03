from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException,Request
from jwt.exceptions import InvalidTokenError

from dotenv import load_dotenv
import os
from db.user import get_user
from errors import UserNotFoundError,credentials_exception
from log import logger
load_dotenv()
# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = os.environ["ALGORITHM"]


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(request: Request):

    token = request.cookies.get("access_token")
    logger.info(f"get_current_user token={token}")

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

   
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_email = payload.get("email")
        logger.info(f"get_current_user user_email={user_email}")
        if user_email is None:
            raise credentials_exception
        
        user = await get_user(email=user_email)
        
        return user

    except InvalidTokenError:
        raise credentials_exception

    except UserNotFoundError:
        raise credentials_exception
   

    

   





