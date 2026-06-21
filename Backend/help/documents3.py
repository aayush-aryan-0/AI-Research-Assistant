from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import uuid
import os
import shutil

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload", response_model=DocumentResponse, status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed"
        )

    # Read file and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be under 10MB"
        )

    # Generate unique filename to avoid conflicts
    ext = ALLOWED_TYPES[file.content_type]
    stored_name = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join("uploads", stored_name)

    # Save file to disk
    with open(file_path, "wb") as f:
        f.write(contents)

    # Save metadata to database
    doc = Document(
        user_id=current_user.id,
        original_name=file.filename,
        stored_name=stored_name,
        file_type=ext,
        file_size=len(contents),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return doc


@router.get("/", response_model=List[DocumentResponse])
def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Document).filter(
        Document.user_id == current_user.id
    ).order_by(Document.upload_date.desc()).all()


@router.delete("/{document_id}", status_code=204)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Delete file from disk
    file_path = os.path.join("uploads", doc.stored_name)
    if os.path.exists(file_path):
        os.remove(file_path)

    # Delete from database
    db.delete(doc)
    db.commit()


@router.get("/download/{document_id}")
def download_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = os.path.join("uploads", doc.stored_name)
    return FileResponse(
        path=file_path,
        filename=doc.original_name,
        media_type="application/octet-stream"
    )