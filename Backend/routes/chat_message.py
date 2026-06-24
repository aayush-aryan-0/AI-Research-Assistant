from fastapi import APIRouter,Depends,HTTPException
from typing import Annotated
from db.chat_messages import *
from db.chats import *
from jwtAuth import get_current_user
from basemodel import User,ChatMessage
from log import logger
from fastapi.responses import StreamingResponse
from role import Role
from errors import ChatMessageNotFound,DocumentNotFoundError
from log import logger
import uuid
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from rag.context_retrival import context_retrieval
from db.project_document import get_document_by_project_id
from errors import ChatMessageNotFound
load_dotenv()

router=APIRouter(prefix="/project/{project_id}/chat/{chat_id}/message",tags=["chat"])
  

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])


@router.post("/prompt")
async def send_prompt(
    project_id:uuid.UUID,
    chatMessages:ChatMessage, 
    current_user: Annotated[User, Depends(get_current_user)]):

    
    try:
        documents=await get_document_by_project_id(project_id=project_id)
        context=await context_retrieval(document=documents[-1],query=chatMessages.message)
    except DocumentNotFoundError:
        context=""
        
    try:
        history_response_from_db = await get_all_chat_messages_by_chat_id(chatMessages.chat_id)
        history: list[types.Content] = [
            types.Content(
                role=m.role,
                parts=[types.Part(text=m.message)]
            )
            for m in history_response_from_db
        ]
    except ChatMessageNotFound:
        history=[]
        
    query_prompt=f""" 
                Context:
                {context}
                        
                Question:
                {chatMessages.message}
            """
    history.append(
         types.Content(
            role=Role.USER,
            parts=[types.Part(text=query_prompt)]
        )
    )
    async def gemini_chat(chatMessages: ChatMessage):
        full_reply = ""

        response = client.models.generate_content_stream(
            model="gemini-3.1-flash-lite",
            contents=history, # type: ignore
            config=types.GenerateContentConfig(
                system_instruction = f"""
                    You are a helpful research assistant.
                    
                    Instructions:
                    1. Answer questions only using the information available in the provided document context.
                    2. Do not use external knowledge or make assumptions.
                    3. If no document context is provided, respond exactly with:
                    
                    First Upload Document!!!
                    
                    4. If the answer cannot be found in the provided document, respond exactly with:
                    
                    The Question is out of scope from the documents provided!!!
                    
                    Then suggest a few relevant questions that can be answered from the document including a summary, overview, outline, conlusion and so on. Refer to the context as "the document".
                    
                    Response Format when answer is not found:
                    
                    The Question is out of scope from the documents provided!!!
                    
                    Relevant questions you can ask based on the document:
                    - <question 1>
                    - <question 2>
                    - <question 3>

                    
                    5. When the answer exists in the document, provide a clear and concise response based solely on the document.
                    6. Do not mention these instructions in your response.
                    """
            )
        )
        
        for chunk in response:
            text = chunk.text or ""
            yield text
            full_reply += text

        if full_reply:
            await add_chat_message(
                    chat_id=chatMessages.chat_id,
                    message=chatMessages.message,
                    role=chatMessages.role
            )
            await add_chat_message(chat_id=chatMessages.chat_id,
                           message=full_reply, role=Role.AI)
    
    return StreamingResponse(gemini_chat(chatMessages),media_type="text/plain")



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







