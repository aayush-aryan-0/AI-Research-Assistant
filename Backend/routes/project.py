from fastapi import APIRouter,Depends,HTTPException
from typing import Annotated
from db.projects import add_project,get_project,get_all_projects_by_user,delete_project,update_project_title
from jwtAuth import get_current_user
from basemodel import User,NewProject,Project,UpdateProjectTitle
from sqlalchemy.exc import IntegrityError
from log import logger
from errors import ProjectNotFound
import uuid
router=APIRouter(prefix="/project",tags=["project"])
  

@router.post("/new")
async def new_project(newProject:NewProject,current_user: Annotated[User, Depends(get_current_user)]):
    try:
        return await add_project(user_id=current_user.id,title=newProject.title)
    except IntegrityError:
        logger.warning("Title already exists")
        raise HTTPException(status_code=400, detail="Title already exists")
    except Exception as e:
        logger.error(f"Error occurred while adding new project: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while adding new project")

@router.post("/get")
async def get_project_(projectRequest:Project,current_user: Annotated[User, Depends(get_current_user)]):
    try:
        return await get_project(id=projectRequest.id)
    except ProjectNotFound:
        logger.warning("Project not found")
        raise HTTPException(status_code=400, detail="Project not Found")
    except Exception as e:
        logger.error(f"Error occurred while getting project: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while getting project")

@router.patch("/update_title")
async def update_title(projectRequest:Project,newTitle:UpdateProjectTitle,current_user: Annotated[User, Depends(get_current_user)]):
    try:
        await update_project_title(new_title=newTitle.title,id=projectRequest.id)
        return {"message":"Title Changed Successfully"}
    except ProjectNotFound:
        logger.warning("Project not found")
        raise HTTPException(status_code=400, detail="Project not Found")
    except Exception as e:
        logger.error(f"Error occurred while updating project title: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while updating project title")


@router.get("/get_all",response_model=list[Project])
async def get_all_projects(
        current_user: Annotated[User,Depends(get_current_user)]
)->list[Project]:
    try:
        return await get_all_projects_by_user(current_user.id)
    except Exception as e:
        logger.error(f"Error occurred while adding new chat user: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while adding new chat")





import pydantic 
class ProjectDeleteRequest(pydantic.BaseModel):
    project_id:uuid.UUID

@router.delete("/delete")
async def delete_project_api(
    projectDeleteRequest:ProjectDeleteRequest,
    current_user:Annotated[User,Depends(get_current_user)])->dict:
    try:
        project=await get_project(projectDeleteRequest.project_id)

        await delete_project(id=project.id)
        return {"deleted": project.title}
    except ProjectNotFound:
        raise HTTPException(status_code=400,detail="No such project found")
    except Exception as e:
        logger.error(f"Error occurred while deleting project: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting project")

    


