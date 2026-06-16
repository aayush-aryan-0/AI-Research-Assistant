from db.users import add_user,get_user,update_user,delete_user
from db.db_engine import init_models
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from sqlalchemy.exc import IntegrityError

from fastapi import HTTPException
from jwtAuth import create_access_token
from basemodel import Token
from datetime import timedelta
from typing import Optional
from log import logger
from errors import UserNotFoundError


ph=PasswordHasher()

__all__ = [
    "startup_user_db",
    "register_user",
    "login_user",
    "update_user_details",
    "delete_user_account",
    "update_user_password"
]

ACCESS_TOKEN_EXPIRE_DAY = 1


async def startup_user_db():
    await init_models()
    logger.info("User database initialized")

def __verify_password(stored_hash:str, entered_password:str)->bool:
    try:
        ph.verify(stored_hash, entered_password)
        return True
    except VerifyMismatchError:
        logger.warning("Password verification failed")
        return False

async def register_user(username:str,full_name:str,email:str,password:str)->dict[str,str]:
    try:
        hashed_password=ph.hash(password)
        await add_user(username=username,full_name=full_name,email=email,hashed_password=hashed_password)
        logger.info(f"User {username} registered successfully")
        return {"message":"User Registered Successfully"}
    except IntegrityError:
        logger.warning("Username or email already exists")
        raise HTTPException(status_code=400, detail="Username or email already exists")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error occurred while registering user: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while registering the user")

async def login_user(username:str,password:str)->Token|None:
    try:
        user=await get_user(username)
        if(user is None):
            raise HTTPException(status_code=400, detail="Invalid Password or Username")
        if __verify_password(user.hashed_password,password):
            access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAY)
            access_token = create_access_token(
            {"email": user.email}, expires_delta=access_token_expires
            )
            return Token(access_token=access_token, token_type="bearer")
        else:
            raise HTTPException(status_code=400, detail="Invalid Password or Username")
    except HTTPException:
        raise 
    except UserNotFoundError:
        logger.warning("User not found during login attempt")
        raise HTTPException(status_code=400, detail="Invalid Password or Username")
    except Exception as e:
        logger.error(f"Error occurred while logging in user: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while logging in the user")

async def update_user_details(old_username:str,old_password:str,new_username:Optional[str]=None,new_full_name:Optional[str]=None,new_email:Optional[str]=None,new_password:Optional[str]=None)->dict[str,str]:
    try:
        user=await get_user(old_username)
        if(user is None):
            raise HTTPException(status_code=400, detail="Invalid Password or Username")
        if not __verify_password(user.hashed_password,old_password):
            raise HTTPException(status_code=400, detail="Invalid current password or username")
        
        await update_user(old_username=old_username,new_username=new_username,new_full_name=new_full_name,new_email=new_email,new_hashed_password= ph.hash(new_password) if new_password else "" )
        logger.info(f"User {old_username} updated successfully")
        return {"message":"User Updated Successfully"}
    except HTTPException:
        raise 
    except UserNotFoundError:
        logger.warning("User not found during update attempt")
        raise HTTPException(status_code=400, detail="User not found")
    except Exception as e:
        logger.error(f"Error occurred while updating user: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while updating the user")


async def update_user_password(username:str,new_password:str)->dict[str,str]:
    try:
        user=await get_user(username)
        if(user is None):
            raise HTTPException(status_code=400, detail="Invalid Password or Username")
        new_hashed_password=ph.hash(new_password)        
        await update_user(old_username=username,new_hashed_password=new_hashed_password)
        return {"message":"User Updated Successfully"}
    except HTTPException:
        raise 
    except UserNotFoundError:
        logger.warning("User not found during update attempt")
        raise HTTPException(status_code=400, detail="User not found")
    except Exception as e:
        logger.error(f"Error occurred while updating user: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while updating the user")




async def delete_user_account(username:str,password:str)->dict[str,str]:
    try:
        user=await get_user(username)
        if(user is None):
            raise HTTPException(status_code=400, detail="Invalid Password or Username")
        if not __verify_password(user.hashed_password,password):
            raise HTTPException(status_code=400, detail="Invalid password or username")
        await delete_user(username=username)
        logger.info(f"User {username} deleted successfully")
        return {"message":"User Deleted Successfully"}
    except HTTPException:
        raise 
    except UserNotFoundError:
        logger.warning("User not found during delete attempt")
        raise HTTPException(status_code=400, detail="User not found")
    except Exception as e:
        logger.error(f"Error occurred while deleting user: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the user")
