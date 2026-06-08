from pydantic import BaseModel,EmailStr,ConfigDict
from typing import List,Optional
from datetime import datetime
from db.chat_history import Role
import uuid

class EmailSchema(BaseModel):
   email: EmailStr

class VerifyEmail(BaseModel):
    email:EmailStr
    otp:str

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class RegisterUser(BaseModel):
    username:str
    full_name:str
    email:EmailStr
    password:str

class User(BaseModel):
    id:uuid.UUID
    username:str
    full_name:str
    email:EmailStr

    model_config = ConfigDict(from_attributes=True) 


class UserInDB(User):
    hashed_password: str
    


class LoginUser(BaseModel):
    username:str
    password:str   
    
class UpdateUser(BaseModel):
    current_password: str
    new_username: Optional[str] = None
    new_full_name: Optional[str] = None
    new_email: Optional[EmailStr]= None
    new_password: Optional[str] = None

class ResetPassword(BaseModel):
    new_password: str

class UpdatePassword(BaseModel):
    current_password:str
    new_password: str

class DeleteUser(BaseModel):
    password:str



class GoogleToken(BaseModel):
    token: str

class DocumentType(BaseModel):
     id:uuid.UUID
     filename:str
     model_config = ConfigDict(from_attributes=True) 
class Chat(BaseModel):
    message:str
    role:Role

class ChatHistory(Chat):
    document_id:uuid.UUID
    timestamp:datetime

    model_config=ConfigDict(from_attributes=True)





class SummeryType(BaseModel):
    id:uuid.UUID
    user_id:uuid.UUID
    document_id:uuid.UUID
    summary_text:str
    created_at:datetime

    model_config=ConfigDict(from_attributes=True)
