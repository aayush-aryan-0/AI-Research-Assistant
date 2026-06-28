import sys
import os
print("1. starting", flush=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
print("2. fastapi imported", flush=True)

from user_auth import startup_db
from log import logger
print("3. user_auth imported", flush=True)

from routes import auth, user, summaries, chat, project, chat_message, project_document, welcome
print("4. routes imported", flush=True)

import db
print("# initalized db")

import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("5. lifespan started", flush=True)
    await startup_db()
    print("6. db ready", flush=True)
    logger.info("Startup")
    yield
    logger.info("Shutdown")

app = FastAPI(lifespan=lifespan)
print("7. app created", flush=True)

origins = [
    "http://192.168.0.7:3000",
    "http://localhost:3000",
    "http://10.170.128.30:3000",
    "https://ai-research-assistant-hxdf.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(summaries.router)
app.include_router(chat.router)
app.include_router(project.router)
app.include_router(project_document.router)
app.include_router(chat_message.router)
app.include_router(welcome.router)

@app.get("/")
async def root():
    return {"message": "Connected to backend successfully!"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
