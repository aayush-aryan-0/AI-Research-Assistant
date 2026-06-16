import enum

class Role(str, enum.Enum):
    USER = "user"
    AI = "assistant"
    