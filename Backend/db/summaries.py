from sqlalchemy import select,func,DateTime,ForeignKey,Text
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from errors import SummaryNotFound
from datetime import datetime
from typing import Sequence
from db.db_engine import session_local,Base
__all__ = [
    "add_summary",
    "get_summary",
    "get_all_summaries_by_project"
]


class __Summaries(Base):
    __tablename__ = 'summaries'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    project_id:Mapped[uuid.UUID] =  mapped_column(UUID,ForeignKey("projects.id"),nullable=False)
    summary_text:Mapped[str] =  mapped_column(Text,nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    def __repr__(self):
        return f"<Summaries(id='{self.id}', userid='{self.user_id},summary_text='{self.summary_text}')>"

async def add_summary(project_id:str,document_id:str,summary_text:str)->None:
    async with session_local() as session:
        try:
            new_document=__Summaries(project_id=project_id,document_id=document_id,summary_text=summary_text)
            session.add(new_document)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e

async def get_summary(id:uuid.UUID)->__Summaries:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Summaries).where(__Summaries.id==id))
            summary=result.scalar_one_or_none()
            if summary is None:
                raise SummaryNotFound()
            return summary
          
        except Exception as e:
            raise e
        
async def get_all_summaries_by_project(project_id:uuid.UUID)->Sequence[__Summaries]:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Summaries).where(__Summaries.project_id==project_id))
            summary=result.scalars().all()
            if not summary:
                raise SummaryNotFound()
            return summary
        except Exception as e:
            raise e
