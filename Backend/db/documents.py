from sqlalchemy import Text,select,DateTime,func,ForeignKey
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from typing import Sequence
from errors import DocumentNotFoundError
from datetime import datetime
from db.db_engine import session_local,Base
__all__ = [
 
    "add_document",
    "get_document_by_user_id",
    "get_document_by_path",
    "delete_document"
]


# Define the documents table model
class __Documents(Base):
    __tablename__ = 'documents'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    user_id:Mapped[uuid.UUID] =  mapped_column(UUID(as_uuid=True),ForeignKey("users.id", ondelete="CASCADE"),nullable=False)
    filename:Mapped[str] =  mapped_column(Text, nullable=False)
    file_path:Mapped[str]= mapped_column(Text,nullable=False,unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )
 
    
    def __repr__(self):
        return f"""<document(id='{self.id}', 
        userid='{self.user_id}'
        ,filename='{self.filename}')>"""

async def add_document(user_id:uuid.UUID,filename:str,file_path:str)->None:
    async with session_local() as session:
        try:
            new_document=__Documents(user_id=user_id,filename=filename,file_path=file_path)
            session.add(new_document)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e

async def delete_document(file_path: str) -> None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Documents).where(__Documents.file_path == file_path))
            document = result.scalar_one_or_none()
            if document is None:
                raise DocumentNotFoundError()
            await session.delete(document)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
async def get_document_by_path(file_path:str)->__Documents:
    async with session_local() as session:
        try:
           
            result = await session.execute(select(__Documents).where(__Documents.file_path==file_path))
            document=result.scalar_one_or_none()
            if not document:
                raise DocumentNotFoundError()
            return document
          
        except Exception as e:
            raise e
        
async def get_document_by_user_id(user_id:uuid.UUID)->Sequence[__Documents]:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Documents).where(__Documents.user_id==user_id))
            documents=result.scalars().all()
            if not documents:
                raise DocumentNotFoundError()
            return documents
        except Exception as e:
            raise e
