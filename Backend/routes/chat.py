from fastapi import APIRouter,Depends,HTTPException
from typing import Annotated
from db.chat_messages import *
from db.chats import *
from jwtAuth import get_current_user
from basemodel import User,NewChat,Chat,UpdateChatTitle,Project
from sqlalchemy.exc import IntegrityError
from log import logger
from errors import ChatNotFound
from log import logger
import uuid
router=APIRouter(prefix="/project/{project_id}/chat",tags=["chat"])
  



@router.post("/new_chat")
async def new_chat(newChat:NewChat,project_id:uuid.UUID,current_user: Annotated[User, Depends(get_current_user)]):
    try:
        return await add_chat(project_id=project_id,title=newChat.title)
    except IntegrityError:
        logger.warning("Title already exists")
        raise HTTPException(status_code=400, detail="Title already exists")
    except Exception as e:
        logger.error(f"Error occurred while creating new chat: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while creating new")
 

@router.post("/get")
async def get_chat_(chat:Chat,current_user: Annotated[User, Depends(get_current_user)]):
    try:
        return await get_chat(id=chat.id)
    except ChatNotFound:
        logger.warning("Chat not found")
        raise HTTPException(status_code=400, detail="Chat not Found")
    except Exception as e:
        logger.error(f"Error occurred while getting chat: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while getting chat")

@router.patch("/{chat_id}/update_title")
async def update_title(chat_id:uuid.UUID,newTitle:UpdateChatTitle,current_user: Annotated[User, Depends(get_current_user)]):
    try:
        await update_chat_title(new_title=newTitle.title,id=chat_id)
        return {"message":"Title Changed Successfully"}
    except ChatNotFound:
        logger.warning("Project not found")
        raise HTTPException(status_code=400, detail="Project not Found")
    except Exception as e:
        logger.error(f"Error occurred while updating project title: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while updating project title")




@router.get("/get_all",response_model=list[Chat])
async def get_all_chat(project_id:uuid.UUID,
        current_user: Annotated[User,Depends(get_current_user)]
)->list[Chat]:
    try:
        return await get_all_chats_by_project(project_id=project_id)
    except ChatNotFound:
        logger.warning("Chat Not Found")
        raise HTTPException(status_code=400,detail="Chat Not Found")
    except Exception as e:
        logger.error(f"Error occurred while veiwing all chat in this project: {str(e)}")
        raise HTTPException(status_code=500, 
                            detail="An error occurred while veiwing all chat in this project")


