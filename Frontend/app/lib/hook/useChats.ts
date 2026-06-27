"use client"

import { useState,useEffect } from "react";
import Chat from "@/app/(protected)/lib/type/Chat.type";
import api from "../api/api";
import { ParamValue } from "next/dist/server/request/params";
import useError from "@/app/(protected)/lib/hooks/useError";
export default function useChats(projectID:ParamValue){
     const [chats, setChats] = useState<Array<Chat>>([])
    const{setError}=useError()
    useEffect(()=>{
        setError("");
        (async()=>{
            try {
                const result = await api.get(`project/${projectID}/chat/get_all`)
                const chats:Array<Chat>=result.data
                if(chats.length===0){
                  return
                }
                setChats(result.data)
                } 
            catch (e) {
                  console.error("Failed to load history", e)
                  setError("Failed to load chats")
            }
        })()
        },[projectID,setError])
        return {chats,setChats}
}