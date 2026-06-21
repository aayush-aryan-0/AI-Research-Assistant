import pymupdf4llm as pmp
import json
import fitz

import uuid

pdf_path="test.pdf"
text=pmp.to_text(pdf_path,header=False,footer=False)
    
file_path=pdf_path.replace(".pdf",".txt")



with open(file_path, "w") as f:
    f.write(text)
