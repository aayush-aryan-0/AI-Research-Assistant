from sqlalchemy import Text,select,DateTime,func,ForeignKey,Enum as SQLEnum
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from typing import Sequence
from errors import DocumentNotFoundError
from datetime import datetime

from db.db_engine import session_local,Base
__all__ = [
    "add_chat_document",
    "get_chat_documents",
    "get_all_chat_documents_by_chat_id",
  
]



class __ChatDocuments(Base):
    __tablename__ = 'chat_documents'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    chat_id:Mapped[uuid.UUID] =  mapped_column(UUID,ForeignKey("chats.id"),nullable=False)
    document_id:Mapped[uuid.UUID] =  mapped_column(UUID,ForeignKey("documents.id"),nullable=False)
    
 
    
    def __repr__(self):
        return f"<document(id='{self.id}',document_id='{self.document_id}')>"


async def add_chat_document(user_id:uuid.UUID,document_id:uuid.UUID)->None:
    async with session_local() as session:
        try:
            new_document=__ChatDocuments(user_id=user_id,document_id=document_id)
            session.add(new_document)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e

async def get_chat_documents(id:uuid.UUID)->__ChatDocuments:
    async with session_local() as session:
        try:
           
            result = await session.execute(select(__ChatDocuments).where(__ChatDocuments.id==id))
            chat=result.scalar_one_or_none()
            if not chat:
                raise DocumentNotFoundError()
            return chat
          
        except Exception as e:
            raise e
        
async def get_all_chat_documents_by_chat_id(chat_id:uuid.UUID)->Sequence[__ChatDocuments]:
    async with session_local() as session:
        try:
            result = await session.execute(select(__ChatDocuments).where(__ChatDocuments.chat_id==chat_id))
            chats=result.scalars().all()
            if not chats:
                raise DocumentNotFoundError()
            return chats
        except Exception as e:
            raise e