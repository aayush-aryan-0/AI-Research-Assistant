"use client"
import { useState} from "react"
import Chat from "../type/Chat.type";
import ChatContext from "../context/ChatContext";
export default function ChatProvider({children,}: {children: React.ReactNode})
{
     const [chat,setChat]=useState<Chat>({
        id:"",
        project_id:"",
        title:"",
        timestamp:""
     });
    
     return(
        <ChatContext.Provider value={{chat,setChat}}>
        {children}
        </ChatContext.Provider>
     )

}
