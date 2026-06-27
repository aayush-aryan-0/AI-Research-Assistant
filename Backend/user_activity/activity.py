import enum

class ActivityType(str, enum.Enum):
    project = "project"
    document = "document"
    chat="chat"
    chat_message="chat_message"

    
    