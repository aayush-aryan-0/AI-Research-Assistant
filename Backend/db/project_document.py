from sqlalchemy import Text,select,DateTime,func,ForeignKey
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from typing import Sequence
from errors import DocumentNotFoundError
from datetime import datetime
from basemodel import ProjectDocumet
from db.db_engine import session_local,Base
__all__ = [
 
    "add_document",
    "get_document_by_project_id",
    "get_document_by_id",
    "delete_document"
]


class __Documents(Base):
    __tablename__ = 'project_documents'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    project_id:Mapped[uuid.UUID] =  mapped_column(UUID(as_uuid=True),
                                               ForeignKey("projects.id", ondelete="CASCADE"),nullable=False)
    filename:Mapped[str] =  mapped_column(Text, nullable=False)
    file_path:Mapped[str]= mapped_column(Text,nullable=False,unique=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )
 
    
    def __repr__(self):
        return f"""<document(id='{self.id}', 
        project_id='{self.project_id}'
        ,filename='{self.filename}')>
        file_path='{self.file_path}')>"""

async def add_document(project_id:uuid.UUID,filename:str,file_path:str)->ProjectDocumet:
    async with session_local() as session:
        try:
            new_document=__Documents(project_id=project_id,filename=filename,file_path=file_path)
            session.add(new_document)
            await session.commit()
            return new_document
        except Exception as e:
            await session.rollback()
            raise e

async def delete_document(id: uuid.UUID) -> None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Documents).where(__Documents.id == id))
            document = result.scalar_one_or_none()
            if document is None:
                raise DocumentNotFoundError()
            await session.delete(document)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
async def get_document_by_id(id:uuid.UUID)->ProjectDocumet:
    async with session_local() as session:
        try:
           
            result = await session.execute(select(__Documents).where(__Documents.id==id))
            document=result.scalar_one_or_none()
            if not document:
                raise DocumentNotFoundError()
            return document
          
        except Exception as e:
            raise e
        
async def get_document_by_project_id(project_id:uuid.UUID)->list[ProjectDocumet]:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Documents).where(__Documents.project_id==project_id))
            documents=result.scalars().all()
            if not documents:
                raise DocumentNotFoundError()
            return list(documents)
        except Exception as e:
            raise e
