import { createContext,Dispatch,SetStateAction } from "react";
import Chat from "../type/Chat.type";
type ChatContext={
    chat:Chat,
    setChat: Dispatch<SetStateAction<Chat>>
}
const ChatContext=createContext<ChatContext|null>(null);


export default ChatContext;