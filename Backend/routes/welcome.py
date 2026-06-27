from fastapi import APIRouter,Depends,HTTPException
from typing import Annotated
from db.chat_messages import *
from db.chats import *
from jwtAuth import get_current_user
from basemodel import User
from fastapi.responses import StreamingResponse



import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

router=APIRouter(prefix="/greetings",tags=["greetings"])
  

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

async def stream_gemini_response(instruction: str, content: str):
    response = client.models.generate_content_stream(
        model="gemini-3.1-flash-lite",
        contents=content,
        config=types.GenerateContentConfig(system_instruction=instruction)
    )
    for chunk in response:
        yield chunk.text or ""

@router.post("/welcome")
async def send_welcome(current_user: Annotated[User, Depends(get_current_user)]):
    instruction = "You are a helpful assistant. Respond only in 3-4 words ending with the user name."
    return StreamingResponse(stream_gemini_response(instruction, f"Greet {current_user.full_name}"), media_type="text/plain")


@router.post("/welcome_message")
async def send_welcome_message(current_user: Annotated[User, Depends(get_current_user)]):
    instruction = f"""
                        You are a helpful assistant specialized in greating people.
                        like this kind of message and its variations:
                        -Here is what's happening with your projects today.
                    """      
    return StreamingResponse(stream_gemini_response(instruction, f"Greet {current_user.full_name}"), media_type="text/plain")

