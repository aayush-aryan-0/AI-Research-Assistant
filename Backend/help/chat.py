from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import os
import ollama

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.chat import Chat, Message
from app.models.document import Document
from app.schemas.chat import ChatResponse, ChatDetailResponse

router = APIRouter(prefix="/chat", tags=["Chat"])

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/", response_model=ChatResponse, status_code=201)
def create_chat(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = Chat(user_id=current_user.id, title="New Chat")
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


@router.get("/", response_model=List[ChatResponse])
def list_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Chat).filter(
        Chat.user_id == current_user.id
    ).order_by(Chat.created_at.desc()).all()


@router.get("/{chat_id}", response_model=ChatDetailResponse)
def get_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.post("/ask", response_model=ChatDetailResponse)
async def ask(
    question: str = Form(...),
    chat_id: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create or get chat
    if chat_id:
        chat = db.query(Chat).filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id
        ).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
    else:
        title = question[:50] + "..." if len(question) > 50 else question
        chat = Chat(user_id=current_user.id, title=title)
        db.add(chat)
        db.commit()
        db.refresh(chat)

    # Handle file upload if provided
    filename = None
    if file and file.filename:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files allowed")

        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size must be under 10MB")

        ext = ALLOWED_TYPES[file.content_type]
        stored_name = f"{uuid.uuid4().hex}.{ext}"
        file_path = os.path.join("uploads", stored_name)

        with open(file_path, "wb") as f:
            f.write(contents)

        # Save to documents table
        doc = Document(
            user_id=current_user.id,
            original_name=file.filename,
            stored_name=stored_name,
            file_type=ext,
            file_size=len(contents),
            chat_id=chat.id,
        )
        db.add(doc)
        db.commit()

        filename = file.filename

    # Save user message
    user_message = Message(
        chat_id=chat.id,
        role="user",
        content=question,
        filename=filename,
    )
    db.add(user_message)

    # Real Ollama response
    try:
        prompt = question
        if filename:
            prompt = f"The user uploaded a file called '{filename}'. {question}"

        response = ollama.chat(
            model="llama3.2",
            messages=[{"role": "user", "content": prompt}]
        )
        ai_reply = response["message"]["content"]

    except Exception as e:
        print("Ollama error:", e)
        ai_reply = "Sorry, I could not generate a response. Make sure Ollama is running."

    ai_message = Message(
        chat_id=chat.id,
        role="assistant",
        content=ai_reply,
    )
    db.add(ai_message)
    db.commit()
    db.refresh(chat)

    return chat


@router.delete("/{chat_id}", status_code=204)
def delete_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    db.delete(chat)
    db.commit()