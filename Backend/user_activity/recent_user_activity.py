from db.projects import get_all_projects_by_user
from db.project_document import get_document_by_project_id
from db.chats import get_all_chats_by_project
from db.chat_messages import get_all_chat_messages_by_chat_id
import uuid
from basemodel import Project,Chat,ProjectDocumet,ChatMessage,ActivityItem
import role
from user_activity.activity import ActivityType
async def recent(user_id: uuid.UUID) -> list[ActivityItem]:

    limit: int = 10

    projects:list[Project] = await get_all_projects_by_user(user_id)
 
    events: list[ActivityItem] = []
 
    for project in projects:
       
        events.append(ActivityItem(
            type=ActivityType.project,
            label=project.title,
            timestamp=project.timestamp
        ))
           
        docs:list[ProjectDocumet] = await get_document_by_project_id(project.id)
        for doc in docs:
            events.append(ActivityItem(
            type=ActivityType.document,
            label=doc.filename,
            timestamp=doc.timestamp
        ))
 
        chats:list[Chat] = await get_all_chats_by_project(project.id)
        for chat in chats:
            events.append(ActivityItem(
            type=ActivityType.chat,
            label=project.title,
            timestamp=project.timestamp
        ))
            chatMessage:list[ChatMessage]=await get_all_chat_messages_by_chat_id(chat_id=chat.id)
            for mssg in chatMessage:
                if(mssg.role==role.Role.USER):
                    events.append(ActivityItem(
            type=ActivityType.chat_message,
            label=project.title,
            timestamp=project.timestamp
        ))
    
   
    events.sort(key=lambda e: e.timestamp, reverse=True)
    return events[:limit]
 


