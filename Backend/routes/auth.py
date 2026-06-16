from fastapi import APIRouter, Response, HTTPException, status,Depends
from datetime import timedelta
from user_auth import register_user,login_user,update_user_password
from db.users import get_is_verified,update_is_verified
from jwtAuth import get_current_user
from log import logger
from basemodel import RegisterUser,LoginUser,EmailSchema,VerifyEmail,GoogleToken,ResetPassword,User
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig,MessageType
from starlette.responses import JSONResponse
from pydantic import SecretStr,NameEmail
import pyotp
from db.users import update_secret,get_secret,get_user,add_user
import os
from dotenv import load_dotenv
from errors import UserNotFoundError
from google_auth import verify_google_token
from jwtAuth import create_access_token
from smtplib import SMTPAuthenticationError,SMTPConnectError,SMTPException
from typing import Annotated
from datetime import timedelta
router=APIRouter(tags=["auth"])
load_dotenv()

ACCESS_TOKEN_EXPIRE_DAY = 1

conf = ConnectionConfig(
    MAIL_USERNAME=os.environ["MAIL_USERNAME"],
    MAIL_PASSWORD=SecretStr(os.environ["MAIL_PASSWORD"]),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,       
    MAIL_SSL_TLS=False,    
    MAIL_FROM=os.environ["MAIL_FROM"],
)
@router.post("/register")
async def register(user:RegisterUser):
    return await register_user(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        password=user.password
    )

@router.post("/login")
async def login(user:LoginUser,response:Response):
    token = await login_user(
        username=user.username,
        password=user.password
    )
    if token is None:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    response.set_cookie(
        key="access_token",
        value=token.access_token,
        httponly=True,
        samesite="lax",
        secure=False,       
        max_age=3600
    )

    return {"message": "Login successful"}

@router.post("/logout")
async def logout(response: Response):

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False, 
        samesite="lax",
    )

    return {"message":"Logged out"}


@router.post("/send_mail")
async def send_mail(email:EmailSchema ):
    try:
        secret = pyotp.random_base32()
        await update_secret(email=str(email.email),secret=secret)
        time_window = 60 * 5
        totp = pyotp.TOTP(s=secret, interval=time_window)
        otp = totp.now()

        html = f"""
        <h2>Email Verification OTP</h2>
        <br>
        <p>Your OTP for email verification for user registration is: </p>
        <br>
        <h1><strong>{otp}</strong></h1>
        <br>
        <p>code expires in 5 minutes </p>
        DON'T SHARE YOUR OTP
        """

        message = MessageSchema(
            subject="AI Research Assistant OTP",
            recipients=[NameEmail(name=str(email.email), email=str(email.email))],
            body=html,
            subtype=MessageType.html
            )

        fm = FastMail(conf)
        await fm.send_message(message)
        logger.info(message)

        return JSONResponse(status_code=200, content={"message": "email has been sent"})
    except UserNotFoundError:
        raise HTTPException(status_code=404,detail="User not found")
    except (SMTPConnectError, ConnectionRefusedError, TimeoutError) as e:
        logger.error(f"Mail server unreachable: {e}")
        raise HTTPException(status_code=503, detail="Could not connect to email server. Try again later.")
    except SMTPAuthenticationError as e:
        logger.critical(f"SMTP auth failed — check credentials: {e}")
        raise HTTPException(status_code=500, detail="Internal mail configuration error")
    except SMTPException as e:
        logger.error(f"SMTP error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error")


@router.post("/verify_mail")
async def verify_mail(verifyEmail: VerifyEmail, response: Response):
    
    try:
        secret = await get_secret(str(verifyEmail.email))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal error fetching secret")
    
    if not secret:
        raise HTTPException(status_code=404, detail="Email not found")
    
    time_window = 60 * 5
    totp = pyotp.TOTP(s=secret, interval=time_window)
    
    if not totp.verify(verifyEmail.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    try:
        user = await get_user(email=str(verifyEmail.email))
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    
    access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAY)
    access_token = create_access_token(
        {"email": user.email},
        expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,  # TODO: set to True in production
        max_age=3600
    )
    
    logger.info("Email OTP verified successfully")
    return {"message": "Verified mail successfully"}

@router.post("/verify_new_mail")
async def verify_new_mail(verifyEmail: VerifyEmail, response: Response):
    
    try:
        secret = await get_secret(str(verifyEmail.email))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal error fetching secret")
    
    if not secret:
        raise HTTPException(status_code=404, detail="Email not found")
    
    time_window = 60 * 5
    totp = pyotp.TOTP(s=secret, interval=time_window)
    
    if not totp.verify(verifyEmail.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    return await update_is_verified(email=verifyEmail.email,is_verified=True)

@router.patch("/reset_password")
async def reset_password( user: ResetPassword,
    current_user: Annotated[User, Depends(get_current_user)]):
    
    return await update_user_password(
            username=current_user.username,
            new_password=user.new_password
        )
   


@router.post("/auth/google")
async def google_auth(payload: GoogleToken,response:Response):
    userinfo = await verify_google_token(payload.token)
    logger.info("USER INFO:")
    logger.info(f"/auth/google userinfo: {userinfo}")
    logger.info(f"/auth/google userinfo[email]: {userinfo["email"]}")
    logger.info(f"/auth/google userinfo[name]: {userinfo["name"]}")
    email = userinfo["email"]
    
    try:
        user = await get_user(email=email)
    except UserNotFoundError:
        await add_user(
            username=email.split("@")[0],
            full_name=userinfo["name"],
            email=email,
            hashed_password=""
        )
    access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAY)
    access_token = create_access_token({"email": email},expires_delta=access_token_expires)
    logger.info(f"/auth/google token={access_token}")
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,       
        max_age=3600
    )
    return {"access_token": access_token}







