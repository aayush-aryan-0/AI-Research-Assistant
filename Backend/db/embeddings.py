from sqlalchemy import Text,select,ForeignKey,RowMapping
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import VECTOR
import uuid
from typing import Sequence
from errors import EmbeddingNotFound
from db.db_engine import session_local,Base

__all__ = [
 
    "add_embedding",
    "get_embedding_by_document_id",
    "get_embedding_by_id",
    "delete_embedding"
]

class __ProjectDocumentEmbeddings(Base):
    __tablename__ = 'project_document_embeddings'

    id:Mapped[uuid.UUID] = mapped_column(
                                UUID(as_uuid=True), 
                                primary_key=True,
                                default=uuid.uuid4
                            )
    document_id:Mapped[uuid.UUID] = mapped_column(
                                        UUID(as_uuid=True),
                                        ForeignKey(
                                            "project_documents.id", 
                                            ondelete="CASCADE"
                                        ),
                                        nullable=False
                                    )
    chunk:Mapped[str] = mapped_column(Text, nullable=False)

    vector = mapped_column(VECTOR, nullable=False)
    
   
    def __repr__(self):
        return f"""<ProjectDocumentsEmbeddings(id='{self.id}', 
        document_id='{self.document_id}'
        ,chunk='{self.chunk}'
        ,vector='{self.vector}'
        >"""

async def add_embedding(
        document_id:uuid.UUID,chunk:str,vector)->__ProjectDocumentEmbeddings:
    
    async with session_local() as session:
        try:
            new_embedding=__ProjectDocumentEmbeddings(
                document_id=document_id,
                chunk=chunk,
                vector=vector
                )
            session.add(new_embedding)
            await session.commit()
            return new_embedding
        except Exception as e:
            await session.rollback()
            raise e

async def delete_embedding(id: uuid.UUID) -> None:

    async with session_local() as session:
        try:
            result = await session.execute(
                select(__ProjectDocumentEmbeddings)
                .where(__ProjectDocumentEmbeddings.id == id))
            embeddings = result.scalar_one_or_none()
            if embeddings is None:
                raise EmbeddingNotFound()
            await session.delete(embeddings)
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
        
async def get_embedding_by_id(
        id:uuid.UUID)->__ProjectDocumentEmbeddings:

    async with session_local() as session:
        try:
           
            result = await session.execute(
                select(__ProjectDocumentEmbeddings).
                where(__ProjectDocumentEmbeddings.id==id))
            embeddings=result.scalar_one_or_none()
            if not embeddings:
                raise EmbeddingNotFound()
            return embeddings
          
        except Exception as e:
            raise e

async def get_chunk(document_id:uuid.UUID,target,limit:int)->list[RowMapping]:

    async with session_local() as session:
        try:
            chunks=await session.execute(
            select(
                __ProjectDocumentEmbeddings.chunk,
                __ProjectDocumentEmbeddings.vector.cosine_distance(target).label("similarity"),
                
            )
            .where(__ProjectDocumentEmbeddings.document_id == document_id)
            .order_by("similarity")
            .limit(limit)
            )
         
            return list(chunks.mappings().all())
        except Exception as e:
            raise e

   

async def get_embeedding_by_id(
        id:uuid.UUID)->__ProjectDocumentEmbeddings:

    async with session_local() as session:
        try:
           
            result = await session.execute(
                select(__ProjectDocumentEmbeddings).
                where(__ProjectDocumentEmbeddings.id==id))
            embeddings=result.scalar_one_or_none()
            if not embeddings:
                raise EmbeddingNotFound()
            return embeddings
          
        except Exception as e:
            raise e
        
async def get_embedding_by_document_id(
        document_id:uuid.UUID)->list[__ProjectDocumentEmbeddings]:
    
    async with session_local() as session:
        try:
            result = await session.execute(
                select(__ProjectDocumentEmbeddings).
                where(__ProjectDocumentEmbeddings.
                document_id==document_id))
            embeddings=list(result.scalars().all())
            if not embeddings:
                raise EmbeddingNotFound()
            return embeddings
        except Exception as e:
            raise e
