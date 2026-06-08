"use client"

import { useRouter } from "next/navigation"
export default function Chat(){
    const router=useRouter();
    return(
        <button 
            onClick={()=>{router.push("/workspace/chat")}}
            className="bg-blue-400 font-bold rounded-2xl p-2"
        >
            Go to Chat
            </button>
    )
}