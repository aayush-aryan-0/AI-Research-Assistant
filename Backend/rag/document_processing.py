import pymupdf4llm as pmp
import fitz
import pymupdf4llm as pmp
import fitz
from rag.cleaning import clean
from rag.chunking import chunking
from pydantic import BaseModel


async def document_processing(pdf_path: str)->tuple[dict,list[str]]:
    
    unprocessed_text = pmp.to_markdown(
        pdf_path, 
        header=False, 
        footer=False
    )

    if not isinstance(unprocessed_text,str):
        raise Exception("unprocessed_text must is be string")

   
    text:str = clean(unprocessed_text) 

    with fitz.open(pdf_path) as document: 
        unprocessed_metadata = document.metadata
        if not isinstance(unprocessed_metadata,dict):
            raise Exception("document.metadata is not a dictionary")
        page_count=document.page_count
    
    chunk_metadata={
        "title":unprocessed_metadata["title"],
        "author":unprocessed_metadata["author"],
        "subject":unprocessed_metadata["subject"],
        "keywords":unprocessed_metadata["keywords"],
        "page_count":page_count

    }

    chunks:list[str] = chunking(text) 

    return chunk_metadata,chunks




