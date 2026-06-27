from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import text
from dotenv import load_dotenv
import os


__all__=["init_models","session_local","Base"]

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_DEV_URL")

if(DATABASE_URL is None):
    raise Exception("Database URL NOT found")

__engine=create_async_engine(DATABASE_URL)

session_local = async_sessionmaker(
    bind=__engine,
    autoflush=False,
    expire_on_commit=False
)

Base=declarative_base()

async def init_models():
    async with __engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)