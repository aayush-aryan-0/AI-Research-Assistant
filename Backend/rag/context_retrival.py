from sentence_transformers import SentenceTransformer
from db.embeddings import get_chunk
from basemodel import ProjectDocumet
from sqlalchemy import RowMapping

__model = SentenceTransformer(
        "all-MiniLM-L6-v2"
    )
async def context_retrieval(
        document:ProjectDocumet,
        query:str, 
        limit:int=3)->str:
    
    query_embedding = __model.encode(query).tolist()
    chunks:list[RowMapping] = await get_chunk(
        document_id=document.id,
        target=query_embedding,
        limit=limit
    )
    return "\n\n".join(
    f"""
    [Chunk {i+1} | similarity score: {row["similarity"]:.3f}]:

    {row["chunk"]}

    """

    for i, row in enumerate(chunks)

    )
   
