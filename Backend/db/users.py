from sqlalchemy import Text,select,String,Boolean
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid

from errors import UserNotFoundError
from typing import Optional
from db.db_engine import session_local,Base
__all__ = [
    "add_user",
    "get_user",
    "update_user",
    "delete_user"
]

class __Users(Base):
    __tablename__ = 'users'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    username:Mapped[str] =  mapped_column(Text, nullable=False,unique=True)
    full_name:Mapped[str] =  mapped_column(Text, nullable=False)
    email:Mapped[str]= mapped_column(Text,nullable=False,unique=True)
    hashed_password:Mapped[str]= mapped_column(Text,nullable=False)
    secret:Mapped[str]=mapped_column(String(32),nullable=True)
    is_verified:Mapped[bool]=mapped_column(Boolean,nullable=False,default=False)
    
    def __repr__(self):
        return f"<User(id='{self.id}', name='{self.username}')>"




async def add_user(username:str,full_name:str,email:str,hashed_password:str)->None:
    async with session_local() as session:
        try:
            new_user=__Users(username=username,full_name=full_name,email=email,hashed_password=hashed_password)
            session.add(new_user)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e

async def update_user(old_username:str,new_username:Optional[str]=None,new_full_name:Optional[str]=None,new_email:Optional[str]=None,new_hashed_password:Optional[str]=None)->None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Users).where(__Users.username==old_username))
            user=result.scalar_one_or_none()
            if user is None:
                raise UserNotFoundError("User not Found")
            if new_username:
                user.username=new_username  
            if new_hashed_password:
                user.hashed_password=new_hashed_password
            if new_full_name:   
                user.full_name = new_full_name
            if new_email:       
                user.email=new_email
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e

async def delete_user(username:str)->None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__User).where(__User.username==username))
            user=result.scalar_one_or_none()
            if user is None:
                raise UserNotFoundError()
            await session.delete(user)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
        

async def get_user(username:str="",email:str="")->__Users|None:
    async with session_local() as session:
        try:
            if username: 
                result = await session.execute(select(__Users).where(__Users.username==username))
                user=result.scalar_one_or_none()
                if user is None:
                    raise UserNotFoundError()
                return user
            if email:
                result = await session.execute(select(__Users).where(__Users.email==email))
                user=result.scalar_one_or_none()
                if user is None:
                    raise UserNotFoundError()
                return user          
                
        except Exception as e:
            raise e

async def update_secret(email: str, secret: str) -> None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Users).where(__Users.email == email))
            user = result.scalar_one_or_none()
            if user is None:
                raise UserNotFoundError()
            user.secret  = secret 
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
async def get_secret(email: str) -> str:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Users).where(__Users.email==email))
            user=result.scalar_one_or_none()
            if user is None:
                raise UserNotFoundError()
            return user.secret
        except Exception as e:
            raise e


async def update_is_verified(email: str,is_verified:bool) -> None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Users).where(__Users.email == email))
            user = result.scalar_one_or_none()
            if user is None:
                raise UserNotFoundError()
            user.is_verified  = is_verified 
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
async def get_is_verified(email: str) -> bool:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Users).where(__Users.email==email))
            user=result.scalar_one_or_none()
            if user is None:
                raise UserNotFoundError()
            return user.is_verified
        except Exception as e:
            raise e




