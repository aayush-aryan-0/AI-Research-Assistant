from fastapi import APIRouter,Depends,HTTPException,UploadFile,File
from db.project_document import get_document_by_project_id,get_document_by_id,add_document,delete_document
from jwtAuth import get_current_user
from typing import Annotated
from basemodel import User,UserInDB,ProjectDocumet
from fastapi.responses import FileResponse
import os
import aiofiles
from Upload.document_extraction import document_extractor
from asyncio import to_thread
from pathlib import Path
from log import logger
import uuid
from errors import DocumentNotFoundError
from pydantic import BaseModel


router=APIRouter(prefix="/project/{project_id}/documents",tags=["project_documents"])

@router.get("/",response_model=list[ProjectDocumet])
async def send_all_documets(project_id:uuid.UUID,
        current_user: Annotated[User,Depends(get_current_user)]
)->list[ProjectDocumet]:
    try:
        return await get_document_by_project_id(project_id)
    except Exception as e:
        logger.error(f"get_document_by_project_id failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/view")
async def view_document(
    project_id:uuid.UUID,
    document_id:uuid.UUID,
    current_user: Annotated[User,Depends(get_current_user)]
)->FileResponse:
    document=await get_document_by_id(document_id)
    path = document.file_path
    if not document or document.project_id != project_id:
        raise HTTPException(status_code=404, detail="Not found")
    if not os.path.exists(document.file_path):
        raise HTTPException(status_code=404, detail="File missing on disk")
    return FileResponse(path=document.file_path, filename=document.filename)
    

@router.post("/upload")
async def upload_file(
    project_id:uuid.UUID,current_user:Annotated[User,Depends(get_current_user)],
    file: UploadFile = File(...))->ProjectDocumet:
    try:
        if not file or file.filename is None:
            raise HTTPException(status_code=400,detail="Provide file or filename")
        suffix=Path(file.filename).suffix.lower()
        if suffix not in {".pdf", ".docx", ".txt"}:
            raise HTTPException(status_code=400, detail=f"Type {suffix!r} not allowed")
        
        safe_name = Path(file.filename).name
        
        path = f"files/{current_user.id}_{uuid.uuid4().hex}_{safe_name}"

        async with aiofiles.open(path, "wb") as f:
            content = await file.read()
            await f.write(content)
        json_path = await (document_extractor(path,current_user.id))
        return await add_document(project_id=project_id,filename=file.filename,file_path=json_path)
    except Exception as e:
        logger.error(f"Error occurred while uploading document: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while uploading document")


class DocumentDeleteRequest(BaseModel):
    document_id:uuid.UUID

@router.delete("/")
async def delete_document_api(
    documentDeleteRequest:DocumentDeleteRequest,
    current_user:Annotated[User,Depends(get_current_user)])->dict:
    try:
        document=await get_document_by_id(documentDeleteRequest.document_id)

        path = document.file_path

        if not os.path.exists(path):
            raise HTTPException(status_code=404, detail="File not found")

        os.remove(path)
        await delete_document(id=document.id)
        return {"deleted": document.filename}
    except DocumentNotFoundError:
        raise HTTPException(status_code=400,detail="No such document found")
    except Exception as e:
        logger.error(f"Error occurred while deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting document")

    


