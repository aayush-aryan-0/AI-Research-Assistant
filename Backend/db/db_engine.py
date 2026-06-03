from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()
__all__=["init_models","session_local","Base"]

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
        await conn.run_sync(Base.metadata.create_all)