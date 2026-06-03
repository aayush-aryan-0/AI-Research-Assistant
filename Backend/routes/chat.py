from fastapi import APIRouter,Depends
from db.chat_history import get_all_chat_by_user,add_chat
from typing import Annotated
from jwtAuth import get_current_user
from basemodel import User,ChatHistory
from pydantic import BaseModel
#GET /chat/{document_id} — get chat history for a paper
router=APIRouter(tags=["chat"])
from fastapi.responses import StreamingResponse
import requests

class UserChatRequest(BaseModel):
    message: str

@router.post("/api/chat")
async def send_history_chat(chat:UserChatRequest, current_user: Annotated[User, Depends(get_current_user)]):
    response=requests.post(
        "http://localhost:11434/api/chat",
        json={
                "model": "llama3:instruct",
                "messages": [
                      {
                          "role": "user", 
                          "content": chat.message
                      }
                  ],
                "stream": False
        }
    )
    return response.json()

    


