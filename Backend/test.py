from user_auth import register_user,login_user,update_user_details,delete_user_account
from Backend.db.user import get_user,add_user,update_user,delete_user
import asyncio
async def call():
        print("Trying to add user")
        await register_user("testuse123r","Test User","tes123t@example.com","TestPassword123!")
        print("User added successfully")
    
asyncio.run(call())