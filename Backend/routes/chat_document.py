from fastapi import APIRouter,Depends,HTTPException,UploadFile,File
from db.documents import get_document_by_user_id,add_document,delete_document
from jwtAuth import get_current_user
from typing import Annotated
from basemodel import User,UserInDB,DocumentType
from fastapi.responses import FileResponse
import os
import aiofiles
from Upload.document_extraction import document_extractor
from asyncio import to_thread
from pathlib import Path
from log import logger
router=APIRouter(prefix="/documents",tags=["documents"])

@router.get("/",response_model=list[DocumentType])
async def send_all_documets(
        current_user: Annotated[User,Depends(get_current_user)]
)->list[DocumentType]:
    user_id=current_user.id
    documents=await get_document_by_user_id(user_id)
    return documents

@router.post("/view")
async def view_document(
    document:DocumentType,
    current_user: Annotated[User,Depends(get_current_user)]
)->FileResponse:
    path = document.file_path
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=path, filename=document.filename)
    

@router.post("/upload")
async def upload_file(current_user:Annotated[User,Depends(get_current_user)],file: UploadFile = File(...)):
    try:
        if not file or file.filename is None:
            raise HTTPException(status_code=400,detail="Provide file or filename")
        safe_name = Path(file.filename).name
        path = f"files/{current_user.id}_{safe_name}"
        async with aiofiles.open(path, "wb") as f:
            content = await file.read()
            await f.write(content)
        json_path = await (document_extractor(path,current_user.id))
        await add_document(user_id=current_user.id,filename=file.filename,file_path=json_path)
        return {
                "filename": file.filename,
                "json_path":json_path 
            }
    except Exception as e:
        logger.error(f"Error occurred while uploading document: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while uploading document")



@router.delete("/")
async def delete_document_api(filename: str,current_user:Annotated[User,Depends(get_current_user)]):
    path = os.path.realpath(os.path.join("files", filename))
    
    if not path.startswith(os.path.realpath("files")):
        raise HTTPException(status_code=400, detail="Nice try")
    
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    
    os.remove(path)
    await delete_document(path)
    return {"deleted": filename}

