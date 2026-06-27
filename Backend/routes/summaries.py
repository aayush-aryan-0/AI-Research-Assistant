from fastapi import APIRouter,Depends
from db.summaries import get_all_summaries_by_project
from typing import Annotated
from jwtAuth import get_current_user
from basemodel import User,SummeryType
import uuid
router=APIRouter(prefix="/project/{project_id}/summaries",tags=["summaries"])

@router.get("/")
async def send_all_summaries(project_id:uuid.UUID,current_user:Annotated[User,Depends(get_current_user)])->list[SummeryType]:
    return await get_all_summaries_by_project(project_id=project_id)
    