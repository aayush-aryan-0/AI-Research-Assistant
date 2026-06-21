from fastapi import APIRouter,Depends,HTTPException
from typing import Annotated
from db.chat_messages import *
from db.chats import *
from jwtAuth import get_current_user
from basemodel import User,ChatMessage,NewChat,Chat
from sqlalchemy.exc import IntegrityError
from log import logger
import json
from fastapi.responses import StreamingResponse
import httpx
from role import Role
from errors import ChatMessageNotFound
from log import logger
import uuid
router=APIRouter(prefix="/project/{project_id}/chat/{chat_id}/message",tags=["chat"])
  
OLLAMA_URL="http://localhost:11434/api/chat"



async def ollama_stream(chatMessages: list[ChatMessage]):
    payload = {
        "model": "llama3:instruct",
        "messages": [{"role": m.role, "content": m.message} for m in chatMessages],
        "stream": True
    }
    full_response = ""

    try:
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", OLLAMA_URL, json=payload) as response:
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    chunk_data = json.loads(line)
                    if chunk_data.get("done", False):
                            break
                    chunk = chunk_data.get("message", {}).get("content", "Not Specified")
                    full_response += chunk
                    yield chunk
    finally:
        if full_response:
            await add_chat_message(chat_id=chatMessages[-1].chat_id,
                           message=chatMessages[-1].message, role=Role.USER)
            await add_chat_message( chat_id=chatMessages[-1].chat_id,
                           message=full_response, role=Role.AI)
            

@router.post("/prompt")
async def send_prompt(chatMessages:list[ChatMessage], current_user: Annotated[User, Depends(get_current_user)]):
   return StreamingResponse(ollama_stream(chatMessages),media_type="text/plain")



@router.get("/get_all",response_model=list[ChatMessage])
async def get_all_chat_messages(chat_id:uuid.UUID,
        current_user: Annotated[User,Depends(get_current_user)]
)->list[ChatMessage]:
    try:
        return await get_all_chat_messages_by_chat_id(chat_id=chat_id)
    except ChatMessageNotFound:
        logger.warning("Chat Not Found")
        raise HTTPException(status_code=400,detail="Chat Not Found")
    except Exception as e:
        logger.error(f"Error occurred while veiwing all chat in this project: {str(e)}")
        raise HTTPException(status_code=500, 
                            detail="An error occurred while veiwing all chat in this project")







