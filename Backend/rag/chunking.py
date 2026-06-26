from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunking(text:str)->list[str]:
    splitter = RecursiveCharacterTextSplitter( 
           chunk_size=5000,
           chunk_overlap=500,
           length_function=len
       )

    return splitter.split_text(text)
