"use client"
import { ParamValue } from "next/dist/server/request/params";
import { useParams } from "next/navigation";
import { useState,useEffect} from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api/api";

type Chat={
    id: string,
    project_id: ParamValue,
    title: string,
    timestamp: Date
}

export default function ProjectPage(){
    const router=useRouter()
    const {projectID}=useParams();
    const [isPending, setTransition] = useTransition()
    const [newChatRequest,setNewChatRequest]=useState({
        title:""
    })
    const [chats,setChats]=useState<Array<Chat>>([]);
    useEffect(() => {
    async function loadHistory() {
      try {
        const result = await api.get(`project/${projectID}/chat/get_all`)
        setChats(result.data)
      } catch (e) {
        console.error("Failed to load history", e)
      }
    }
    loadHistory()
  }, [projectID])

    async function newChat(){
        setTransition(async () => {
            const result = await api.post(
                `/project/${projectID}/chat/new_chat`,newChatRequest)
            router.push(`/chat/${result.data}`)
        })
       
    }


    return(
        <div>
            <div></div>
            <form
                className="flex flex-col"
                onSubmit={(e)=>{
                    e.preventDefault();
                    newChat();
                }}
                >

                    <div >
                        <input 
                            type="text" value.title
                            placeholder="Enter Your Message"
                            value={newChatRequest.title}
                            onChange={
                                (e: React.ChangeEvent<HTMLInputElement>) =>
                                        setNewChatRequest({
                                            title:e.target.value
                                        })
                            }
                        
                            className="bg-gray-500 rounded-l-2xl p-1 px-2
                        
                            "
                        />
                        <button
                            type="submit"

                            disabled={isPending}
                            className="bg-lime-600 text-white 
                            rounded-r-2xl p-1 px-2.5"
                        >
                           {isPending?"loading...":"➤"}
                        </button>
                    </div>

                </form>

                <div>
                    <ul>
                            {chats.map((value,index)=>(
                                <li
                                key={index}
                                >
                                    <div onClick={()=>{router.push(`/chat/${value.id}`)}}>
                                        <span>value.title</span>
                                        <span>value.timestamp</span>
                                    </div>
                                </li>
                            ))}
                    </ul>
                    
                </div>
            
            <div>
                <span>Other chats</span>
            </div>
        </div>
    )
}