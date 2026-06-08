from fastapi import APIRouter,Depends
from typing import Annotated,AsyncIterable
from db.chat_history import *
from jwtAuth import get_current_user
from basemodel import User,ChatHistory
from pydantic import BaseModel
import json
router=APIRouter(prefix="/chat",tags=["chat"])
from fastapi.responses import StreamingResponse
import httpx




@router.get("/",response_model=list[ChatHistory])
async def send_history_chat(
        current_user: Annotated[User,Depends(get_current_user)]
)->list[ChatHistory]:
    user_id=current_user.id
    chat_history=await get_all_chat_by_user(user_id)
    return chat_history




OLLAMA_URL="http://localhost:11434/api/chat"

async def ollama_stream(chats: list[ChatHistory], user_id, document_id):
    payload = {
        "model": "llama3:instruct",
        "messages": [{"role": m.role, "content": m.message} for m in chats],
        "stream": True
    }
    full_response = ""

    try:
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", OLLAMA_URL, json=payload) as response:
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    data = json.loads(line)
                    if data["done"]:
                        break
                    chunk = data["message"]["content"]
                    full_response += chunk
                    yield chunk
    finally:
      
        if full_response and document_id:
            await add_chat(user_id=user_id, document_id=document_id,
                           message=chats[-1].message, role=Role.USER)
            await add_chat(user_id=user_id, document_id=document_id,
                           message=full_response, role=Role.AI)
@router.post("/prompt")
async def send_prompt(chats:list[ChatHistory], current_user: Annotated[User, Depends(get_current_user)]):
   return StreamingResponse(
        ollama_stream(
            chats, current_user.id, 
            chats[0].document_id if chats and chats[0].document_id else None),
        media_type="text/plain")

    





