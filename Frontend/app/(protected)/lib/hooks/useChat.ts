"use client"
import ChatContext from "../context/ChatContext";
import { useContext } from "react";
export default function useChat(){
    const chatContext=useContext(ChatContext);
    if(chatContext===null){
        throw Error("MUST USE INSIDE chat context provider")
    }
    return chatContext;
}