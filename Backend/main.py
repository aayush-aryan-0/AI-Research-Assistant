from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from user_auth import startup_user_db
from log import logger
from routes import auth, user, documents,summaries,chat,project,chat_message,project_document
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    await startup_user_db()
    logger.info("Startup")
    yield
    logger.info("Shutdown")

app = FastAPI(lifespan=lifespan)

origins = [
    "http://192.168.0.7:3000",
    "http://localhost:3000",
    "http://10.170.128.30:3000"
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
app.include_router(documents.router)
app.include_router(summaries.router)
app.include_router(chat.router)
app.include_router(project.router)
app.include_router(project_document.router)
app.include_router(chat_message.router)

@app.get("/")
async def root():
    return {"message": "Connected to backend successfully!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)