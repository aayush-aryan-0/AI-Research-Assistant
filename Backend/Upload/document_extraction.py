import pymupdf4llm as pmp
import re
import json
import fitz
import aiofiles
import uuid
import unicodedata
import asyncio

BOILERPLATE_PATTERNS = [
    r"copyright\s*©?\s*\d{4}(?:\s*[-–]\s*\d{4})?",
    r"all rights reserved",
    r"©\s*\d{4}",
    r"confidential(?:\s+and\s+proprietary)?",
    r"for\s+internal\s+use\s+only",
    r"page\s+\d+\s+of\s+\d+",
    r"printed\s+on\s+\d{1,2}/\d{1,2}/\d{2,4}",
]

def _extract_and_clean(pdf_path: str) -> tuple[str, dict, int]:
   
    text = pmp.to_markdown(pdf_path, header=False, footer=False)

   
    text = unicodedata.normalize("NFKD", str(text))

    
    text = re.sub(r'\S+@\S+', '', text)

    
    for pattern in BOILERPLATE_PATTERNS:
        text = re.sub(pattern, "", text, flags=re.IGNORECASE)

   
    text = re.sub(r'Page\s+\d+', '', text, flags=re.IGNORECASE)

   
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    text = text.strip()

    with fitz.open(pdf_path) as doc:
        metadata = doc.metadata
        page_count = doc.page_count

    return text, metadata, page_count


async def document_extractor(pdf_path: str, user_id: uuid.UUID) -> str:
    loop = asyncio.get_event_loop()
    text, metadata, page_count = await loop.run_in_executor(
        None, _extract_and_clean, pdf_path
    )

    pdf_data = {
        "metadata": metadata,
        "page_count": page_count,
        "source": pdf_path,
        "uploaded_by": str(user_id),
        "text": text,
    }

    json_path = pdf_path.replace(".pdf", ".json")
    async with aiofiles.open(json_path, "w") as f:
        await f.write(json.dumps(pdf_data, ensure_ascii=False))

    return json_path