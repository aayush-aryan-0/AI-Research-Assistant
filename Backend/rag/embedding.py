
import uuid
from db.embeddings import add_embedding

async def emebedding(project_id:uuid.UUID,document_id:uuid.UUID,chunk_metadata:dict,chunks:list[str]):
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer(
        "all-MiniLM-L6-v2"
    )
  
    for chunk in chunks:
        vector = model.encode(chunk).tolist()
        await add_embedding(
            project_id=project_id,
            document_id=document_id,
            chunk_metadata=chunk_metadata,
            chunk=chunk,
            vector=vector
        )

