import pymupdf4llm as pmp
import json
import fitz
import aiofiles
import uuid
import pymupdf4llm as pmp
import json
import fitz

from rag.cleaning import clean
from rag.chunking import chunking

async def document_processing(
        pdf_path: str, 
        user_id: uuid.UUID
        )->tuple:
    
    unprossed_text = pmp.to_markdown(
        pdf_path, 
        header=False, 
        footer=False
    )

    if not isinstance(unprossed_text,str):
        raise Exception("unprocessed_text must is be string")

   
    text:str = clean(unprossed_text) 

    with fitz.open(pdf_path) as doc: 
        metadata = doc.metadata
        if not isinstance(metadata,dict):
            raise Exception("metadata must be a dict")
        page_count = doc.page_count

    chunks:list[str] = chunking(text) 

    pdf_data = {
        "metadata": metadata,
        "page_count": page_count,
        "source": pdf_path,
        "uploaded_by": str(user_id),
        "chunks": chunks,
    }

    json_path = pdf_path.replace(".pdf", ".json")
    async with aiofiles.open(json_path, "w") as f:
        await f.write(json.dumps(pdf_data, ensure_ascii=False))

    return json_path,chunks





