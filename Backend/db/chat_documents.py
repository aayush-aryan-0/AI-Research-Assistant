from sqlalchemy import Text,select,DateTime,func,ForeignKey,Enum as SQLEnum
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from typing import Sequence
from errors import ChatNotFound
from datetime import datetime
import enum
from db.db_engine import session_local,Base
__all__ = [
    "add_chat",
    "get_chat",
    "get_all_chat_by_user",
    "Role"
]


class Role(str, enum.Enum):
    AI = "assistant"
    USER = "user"
# Define the User table model
class __Chat_history(Base):
    __tablename__ = 'chat_history'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    user_id:Mapped[uuid.UUID] =  mapped_column(UUID,ForeignKey("users.id", ondelete="CASCADE"),nullable=False)
    chats_id:Mapped[uuid.UUID] =  mapped_column(UUID,ForeignKey("chats.id"),nullable=False)
    message:Mapped[str] =  mapped_column(Text,nullable=False)
    role:Mapped[Role] =  mapped_column(SQLEnum(Role), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )
 
    
    def __repr__(self):
        return f"<document(id='{self.id}', userid='{self.user_id},message='{self.message}')>"


async def add_chat(user_id:uuid.UUID,document_id:uuid.UUID,message:str,role:Role)->None:
    async with session_local() as session:
        try:
            new_document=__Chat_history(user_id=user_id,document_id=document_id,message=message,role=role)
            session.add(new_document)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e

async def get_chat(id:uuid.UUID)->__Chat_history:
    async with session_local() as session:
        try:
           
            result = await session.execute(select(__Chat_history).where(__Chat_history.id==id))
            chat=result.scalar_one_or_none()
            if not chat:
                raise ChatNotFound()
            return chat
          
        except Exception as e:
            raise e
        
async def get_all_chat_by_user(user_id:uuid.UUID)->Sequence[__Chat_history]:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Chat_history).where(__Chat_history.user_id==user_id))
            chats=result.scalars().all()
            if not chats:
                raise ChatNotFound()
            return chats
        except Exception as e:
            raise e