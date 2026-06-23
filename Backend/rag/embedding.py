from sentence_transformers import SentenceTransformer
from db.embeddings import add_embedding
from basemodel import ProjectDocumet


async def emebedding(chunks:list[str],document:ProjectDocumet):
    
    model = SentenceTransformer(
        "all-MiniLM-L6-v2"
    )
  
    for chunk in chunks:
        vector = model.encode(chunk).tolist()
        await add_embedding(
            document_id=document.id,
            chunk=chunk,
            vector=vector
        )

