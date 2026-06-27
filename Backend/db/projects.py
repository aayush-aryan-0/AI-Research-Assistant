from sqlalchemy import Text,select,DateTime,func,ForeignKey,Enum as SQLEnum,or_
from sqlalchemy.orm import Mapped,mapped_column,relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from basemodel import Project
from errors import ProjectNotFound
from datetime import datetime
from db.db_engine import session_local,Base
__all__ = [
    "add_project",
    "get_project",
    "update_project_title",
    "get_all_projects_by_user",
    "delete_project"
   
]


class __Projects(Base):
    __tablename__ = 'projects'

    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True,default=uuid.uuid4)
    user_id:Mapped[uuid.UUID] =  mapped_column(UUID,ForeignKey("users.id", ondelete="CASCADE"),nullable=False)
    title:Mapped[str] =  mapped_column(Text,nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )


    chats = relationship(
        "__Chats", 
        back_populates="project", 
        cascade="all, delete-orphan"
    )
    documents = relationship(
        "__ProjectDocumet", 
        back_populates="project", 
        cascade="all, delete-orphan"
    )
 
    
    def __repr__(self):
        return f"<project(id='{self.id}', user_id='{self.user_id},title='{self.title}')>"


async def add_project(user_id:uuid.UUID,title:str)->Project:
    async with session_local() as session:
        try:
            new_project=__Projects(user_id=user_id,title=title)
            session.add(new_project)
            await session.commit()
            return new_project
        except Exception as e:
            await session.rollback()
            raise e

async def get_project(id:uuid.UUID|None=None)->Project:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Projects).where(__Projects.id==id))
            project=result.scalar_one_or_none()
            if not project:
                raise ProjectNotFound()
            return project
          
        except Exception as e:
            raise e

async def update_project_title(new_title:str,id:uuid.UUID|None=None)->None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Projects).where(__Projects.id==id))
            project=result.scalar_one_or_none()
            if not project:
                raise ProjectNotFound()
            project.title=new_title            
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
        
        
async def get_all_projects_by_user(user_id:uuid.UUID)->list[Project]:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Projects).where(__Projects.user_id==user_id))
            projects=result.scalars().all()
            return list(projects)
        except Exception as e:
            raise e
        
async def delete_project(id: uuid.UUID) -> None:
    async with session_local() as session:
        try:
            result = await session.execute(select(__Projects).where(__Projects.id == id))
            project = result.scalar_one_or_none()
            if project is None:
                raise ProjectNotFound()
            await session.delete(project)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e