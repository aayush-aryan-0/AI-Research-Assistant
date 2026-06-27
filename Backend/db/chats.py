from sqlalchemy import Text,select,DateTime,func,ForeignKey
from sqlalchemy.orm import Mapped,mapped_column,relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from errors import ChatNotFound
from datetime import datetime
from db.db_engine import session_local,Base
from basemodel import Chat

__all__ = [
    "add_chat",
    "get_chat",
    "update_chat_title",
    "get_all_chats_by_project",
    "delete_chat"
   
]

  
class __Chats(Base):
    __tablename__ = 'chats'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    project_id:Mapped[uuid.UUID] =  mapped_column(UUID,ForeignKey("projects.id", ondelete="CASCADE"),nullable=False)
    title:Mapped[str] =  mapped_column(Text,nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )
    
    project = relationship("__Projects", back_populates="chats")
    
  
    messages = relationship(
        "__ChatMessage", 
        back_populates="chat", 
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        return f"<document(id='{self.id}', project_id='{self.project_id},title='{self.title}')>"


async def add_chat(project_id:uuid.UUID,title:str)->Chat:
    async with session_local() as session:
        try:
            new_chat=__Chats(project_id=project_id,title=title)
            session.add(new_chat)
            await session.commit()
            return new_chat
        except Exception as e:
            await session.rollback()
            raise e

async def get_chat(id:uuid.UUID)->Chat:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Chats).where(__Chats.id==id))
            chat=result.scalar_one_or_none()
            if not chat:
                raise ChatNotFound()
            return chat
          
        except Exception as e:
            raise e

async def update_chat_title(new_title:str,id:uuid.UUID)->None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Chats).where(__Chats.id==id))
            chat=result.scalar_one_or_none()
            if not chat:
                raise ChatNotFound()
            chat.title=new_title            
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
        
async def get_all_chats_by_project(project_id:uuid.UUID)->list[Chat]:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Chats).where(__Chats.project_id==project_id))
            chats=result.scalars().all()
            return list(chats)
        except Exception as e:
            raise e
        

async def delete_chat(id: uuid.UUID) -> None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Chats).where(__Chats.id == id))
            chat = result.scalar_one_or_none()
            if chat is None:
                raise ChatNotFound()
            await session.delete(chat)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e