from db.projects import get_all_projects_by_user
from db.project_document import get_document_by_project_id
from db.chats import get_all_chats_by_project
from db.chat_messages import get_all_chat_messages_by_chat_id
import uuid
from basemodel import Project,Chat,ProjectDocumet,ChatMessage,StatsResponse
async def total(user_id:uuid.UUID)->StatsResponse:
    projects:list[Project]=await get_all_projects_by_user(user_id=user_id)

    total_projects=len(projects)
    total_chats=0
    total_chat_messages=0
    total_documents=0

    for project in projects:
        chats:list[Chat]=await get_all_chats_by_project(project_id=project.id)
        total_chats+=len(chats)
        for chat in chats:
            chat_messages:list[ChatMessage]= await get_all_chat_messages_by_chat_id(chat_id=chat.id)
            total_chat_messages+=len(chat_messages)
        documents:list[ProjectDocumet] = await get_document_by_project_id(project_id=project.id)
        total_documents+=len(documents)
    
    return StatsResponse(
        total_projects=total_projects,
        total_chats=total_chats,
        total_chat_messages=total_chat_messages,
        total_documents=total_documents
    )
       
        

