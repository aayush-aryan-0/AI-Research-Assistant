from fastapi import Depends,Response,HTTPException,APIRouter
from user_auth import update_user_details,delete_user_account,update_user_password
from basemodel import DeleteUser,UpdateUser,User,UserInDB,UpdatePassword,ActivityItem,StatsResponse
from jwtAuth import get_current_user
from dotenv import load_dotenv
from errors import UserNotFoundError
from typing import Annotated
from user_activity import total_user_activity,recent_user_activity
load_dotenv()

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/profile",response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user

@router.put("/update_user")
async def update_user( user: UpdateUser,
    current_user: Annotated[User, Depends(get_current_user)]):

    return await update_user_details(
            old_username=current_user.username,
            old_password=user.current_password,
            new_username=user.new_username,
            new_full_name=user.new_full_name,
            new_email=user.new_email,
            new_password=user.new_password
        )
   
@router.patch("/update_password")
async def update_password( user: UpdatePassword,
    current_user: Annotated[User, Depends(get_current_user)]):
    
    return await update_user_password(
            username=current_user.username,
            new_password=user.new_password
        )
   


@router.delete("/delete_user")
async def delete_user(user:DeleteUser,response:Response,
                    current_user:Annotated[UserInDB,Depends(get_current_user)]):
    try:
         await delete_user_account(
            username=current_user.username,
            password=user.password
        )
    except UserNotFoundError:
        raise HTTPException(status_code=404,detail="User Not found")
    
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False, 
        samesite="lax",
    )
   
    return {"message":"account deleted successfully"}


 
 

@router.get("/stats", response_model=StatsResponse)
async def stats(user=Depends(get_current_user)):
    return await total_user_activity.total(user.id)
 
 
@router.get("/activity", response_model=list[ActivityItem])
async def activity(user=Depends(get_current_user)):
    return await recent_user_activity.recent(user.id)
 

    