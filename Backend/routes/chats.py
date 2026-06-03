from fastapi import APIRouter,Depends
from db.chat_history import get_all_chat_by_user,add_chat
from typing import Annotated
from jwtAuth import get_current_user
from basemodel import User,ChatHistory
#GET /chat/{document_id} — get chat history for a paper
router=APIRouter(prefix="/chats",tags=["chats"])

@router.get("/",response_model=list[ChatHistory])
async def send_history_chat(
        current_user: Annotated[User,Depends(get_current_user)]
)->list[ChatHistory]:
    user_id=current_user.id
    documents=await get_all_chat_by_user(user_id)
    return documents

@router.post("/new_message")
async def new_message(new_chat:ChatHistory,current_user:Annotated[User,Depends(get_current_user)]):
    
    await add_chat(user_id=current_user.id,document_id=new_chat.document_id, message=new_chat.message, role=new_chat.role)
    return {"message":"Chat saved successfully"}
