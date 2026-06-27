from db.embeddings import get_chunk
import uuid
from basemodel import Context

_model = None

def get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

async def context_retrieval(
        project_id: uuid.UUID,
        query: str,
        limit: int = 3) -> str:
    
    model = get_model()
    query_embedding = model.encode(query).tolist()
    chunks: list[Context] = await get_chunk(
        project_id=project_id,
        target=query_embedding,
        limit=limit
    )
    return "\n\n".join(
        f"""
    [Chunk {i+1} | similarity score: {row.similarity:.3f}]:
    [Metadata {row.chunk_metadata}]
    {row.chunk}
    """
        for i, row in enumerate(chunks)
    )
