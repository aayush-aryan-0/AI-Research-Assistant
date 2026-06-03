from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import HTTPException
from log import logger
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

async def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        logger.info(f"inside google_auth.py {idinfo}")
        logger.info(f"inside google_auth.py {idinfo['email']}")
        logger.info(f"inside google_auth.py {idinfo['name']}")
        return idinfo  # contains email, name, picture
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
