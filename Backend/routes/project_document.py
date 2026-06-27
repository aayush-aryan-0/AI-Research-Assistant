from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from db.project_document import get_document_by_project_id, get_document_by_id, add_document, delete_document
from jwtAuth import get_current_user
from typing import Annotated
from basemodel import User, ProjectDocumet
import os
import aiofiles
from pathlib import Path
from log import logger
import uuid
from errors import DocumentNotFoundError
from pydantic import BaseModel

router = APIRouter(prefix="/project/{project_id}/documents", tags=["project_documents"])


async def process_document(tmp_path: str, project_id: uuid.UUID, document_id: uuid.UUID):
    try:
        from rag.document_processing import document_processing
        chunk_metadata, chunks = await document_processing(pdf_path=tmp_path)

        from rag.embedding import emebedding
        await emebedding(
            project_id=project_id,
            document_id=document_id,
            chunk_metadata=chunk_metadata,
            chunks=chunks
        )
        logger.info(f"Document {document_id} processed successfully")
    except Exception as e:
        logger.error(f"Background processing failed for {document_id}: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.get("/get_all", response_model=list[ProjectDocumet])
async def send_all_documets(
    project_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)]
) -> list[ProjectDocumet] | None:
    try:
        return await get_document_by_project_id(project_id)
    except Exception as e:
        logger.error(f"get_document_by_project_id failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def upload_file(
    project_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
) -> dict:
    try:
        if not file or file.filename is None:
            raise HTTPException(status_code=400, detail="Provide file or filename")

        suffix = Path(file.filename).suffix.lower()
        if suffix not in {".pdf", ".docx", ".txt"}:
            raise HTTPException(status_code=400, detail=f"Type {suffix!r} not allowed")

        safe_name = Path(file.filename).name
        tmp_path = f"/tmp/{current_user.id}_{uuid.uuid4().hex}_{safe_name}"

        async with aiofiles.open(tmp_path, "wb") as f:
            content = await file.read()
            await f.write(content)

        document = await add_document(
            project_id=project_id,
            filename=file.filename,
            file_path=tmp_path
        )

        background_tasks.add_task(
            process_document,
            tmp_path=tmp_path,
            project_id=project_id,
            document_id=document.id
        )

        return {"message": "Upload received, processing...", "id": str(document.id), "filename": file.filename}

    except Exception as e:
        logger.error(f"Error occurred while uploading document: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while uploading document")


class DocumentDeleteRequest(BaseModel):
    document_id: uuid.UUID


@router.delete("/delete")
async def delete_document_api(
    documentDeleteRequest: DocumentDeleteRequest,
    current_user: Annotated[User, Depends(get_current_user)]
) -> dict:
    try:
        document = await get_document_by_id(documentDeleteRequest.document_id)
        await delete_document(id=document.id)
        return {"deleted": document.filename}
    except DocumentNotFoundError:
        raise HTTPException(status_code=400, detail="No such document found")
    except Exception as e:
        logger.error(f"Error occurred while deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting document")