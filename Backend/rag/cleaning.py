import re
import unicodedata

BOILERPLATE_PATTERNS = [
    r"copyright\s*©?\s*\d{4}(?:\s*[-–]\s*\d{4})?",
    r"all rights reserved",
    r"©\s*\d{4}",
    r"confidential(?:\s+and\s+proprietary)?",
    r"for\s+internal\s+use\s+only",
    r"page\s+\d+\s+of\s+\d+",
    r"printed\s+on\s+\d{1,2}/\d{1,2}/\d{2,4}",
]

def clean(text: str) -> str:

    text = unicodedata.normalize("NFKD", str(text))
    text = re.sub(r'\S+@\S+', '', text) 

    for pattern in BOILERPLATE_PATTERNS:
        text = re.sub(pattern, "", text, flags=re.IGNORECASE)

    text = re.sub(r'Page\s+\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    text = text.strip()

    return text

