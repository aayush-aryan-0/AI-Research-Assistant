from sqlalchemy import Text,select,DateTime,func,ForeignKey,Enum as SQLEnum
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from role import Role
from errors import ChatMessageNotFound
from db.db_engine import session_local,Base
from basemodel import ChatMessage
__all__ = [
    "add_chat_message",
    "get_chat_message",
    "get_all_chat_messages_by_chat_id",
 
]



# Define the User table model
class __ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    chat_id:Mapped[uuid.UUID] =  mapped_column(UUID,ForeignKey("chats.id"),nullable=False)
    message:Mapped[str] =  mapped_column(Text,nullable=False)
    role:Mapped[Role] =  mapped_column(SQLEnum(Role), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )
 
    
    def __repr__(self):
        return f"<document(id='{self.id}', userid='{self.user_id},message='{self.message}')>"


async def add_chat_message(chat_id:uuid.UUID,message:str,role:Role)->None:
    async with session_local() as session:
        try:
            new_document=__ChatMessage(chat_id=chat_id,message=message,role=role)
            session.add(new_document)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e

async def get_chat_message(id:uuid.UUID)->ChatMessage:
    async with session_local() as session:
        try:
           
            result = await session.execute(select(__ChatMessage).where(__ChatMessage.id==id))
            chat=result.scalar_one_or_none()
            if not chat:
                raise ChatMessageNotFound()
            return chat
          
        except Exception as e:
            raise e
        
async def get_all_chat_messages_by_chat_id(chat_id:uuid.UUID)->list[ChatMessage]:
    async with session_local() as session:
        try:
            result = await session.execute(select(__ChatMessage).where(__ChatMessage.chat_id==chat_id))
            chats=result.scalars().all()
            if not chats:
                raise ChatMessageNotFound()
            return list(chats)
        except Exception as e:
            raise e