from sqlalchemy import Text,select,ForeignKey,RowMapping
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.dialects.postgresql import UUID,JSONB
from pgvector.sqlalchemy import VECTOR
import uuid
from db.db_engine import session_local,Base
from basemodel import Context
__all__ = [
 
    "add_embedding",
    "get_chunk",

]

class __ProjectDocumentEmbeddings(Base):
    __tablename__ = 'project_document_embeddings'

    id:Mapped[uuid.UUID] = mapped_column(
                                UUID(as_uuid=True), 
                                primary_key=True,
                                default=uuid.uuid4
                            )
    project_id:Mapped[uuid.UUID] = mapped_column(
                                        UUID(as_uuid=True),
                                        ForeignKey(
                                            "projects.id", 
                                            ondelete="CASCADE"
                                        ),
                                        nullable=False
                                    )
    document_id:Mapped[uuid.UUID] = mapped_column(
                                        UUID(as_uuid=True),
                                        ForeignKey(
                                            "project_documents.id", 
                                            ondelete="CASCADE"
                                        ),
                                        nullable=False
                                    )
    chunk_metadata:Mapped[dict]=mapped_column(JSONB,nullable=False)
    chunk:Mapped[str] = mapped_column(Text, nullable=False)

    vector = mapped_column(VECTOR(384), nullable=False)
    
   
    def __repr__(self):
        return f"""<ProjectDocumentsEmbeddings(id='{self.id}', 
        document_id='{self.document_id}'
        ,chunk='{self.chunk}'
        ,vector='{self.vector}'
        >"""

async def add_embedding(
        project_id:uuid.UUID,
        document_id:uuid.UUID,
        chunk_metadata:dict,
        chunk:str,vector)->__ProjectDocumentEmbeddings:
    
    async with session_local() as session:
        try:
            new_embedding=__ProjectDocumentEmbeddings(
                project_id=project_id,
                document_id=document_id,
                chunk_metadata=chunk_metadata,
                chunk=chunk,
                vector=vector
                )
            session.add(new_embedding)
            await session.commit()
            return new_embedding
        except Exception as e:
            await session.rollback()
            raise e



async def get_chunk(
        target,
        limit:int,
        project_id:uuid.UUID|None=None,
        document_id:uuid.UUID|None=None,
       )->list[Context]:
    
    if not project_id and not document_id:
        raise Exception("Invalid arguments! Give project_id or document_id! Both cannot be none!")
  
    async with session_local() as session:
        try:

            if project_id:
                conditon=__ProjectDocumentEmbeddings.project_id == project_id
            else:
                conditon=__ProjectDocumentEmbeddings.document_id == document_id


            similarity = (1 - __ProjectDocumentEmbeddings.
                          vector.cosine_distance(target)).label("similarity")
            #threshold_similarity=0.2
            chunks = await session.execute(
            select(
                    __ProjectDocumentEmbeddings.chunk,
                    __ProjectDocumentEmbeddings.chunk_metadata,
                    similarity
                )
                .where(conditon)
                #.where(similarity >= threshold_similarity)
                .order_by(similarity.desc())
                .limit(limit)
            )            
            return [Context.model_validate(dict(row)) for row in chunks.mappings().all()]
        except Exception as e:
            raise e


