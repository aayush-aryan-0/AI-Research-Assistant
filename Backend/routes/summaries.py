from fastapi import APIRouter,Depends
from db.summaries import get_all_summaries_by_user
from typing import Annotated
from jwtAuth import get_current_user
from basemodel import User,SummeryType
router=APIRouter(prefix="/summaries",tags=["summaries"])

@router.get("/")
async def send_all_summaries(current_user:Annotated[User,Depends(get_current_user)])->list[SummeryType]:
    return await get_all_summaries_by_user(user_id=current_user.id)
    