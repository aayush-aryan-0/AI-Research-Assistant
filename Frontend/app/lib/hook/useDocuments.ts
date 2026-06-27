"use client"

import { useState,useEffect } from "react";
import Document from "@/app/types/Doucument.type";
import api from "../api/api";
import { isAxiosError } from "axios";
import { ParamValue } from "next/dist/server/request/params";
import useError from "@/app/(protected)/lib/hooks/useError";
export default function useDocuments(projectID:ParamValue){
     const [documents, setDocuments] = useState<Array<Document>>([])
        const {setError}=useError()

    useEffect(()=>{
        (async()=>{

            try {
              const result = await api.get(`/project/${projectID}/documents/`)
              const documents:Array<Document> = result.data
              if (documents.length===0){
                return
              }
              setDocuments(documents)
            } catch (e) {
              if (isAxiosError(e)) console.log(e.cause)
              else console.error("Failed to load documents", e)
              setError("Failed to load documents")
            }
        })()
        },[projectID,setError])
        return {documents,setDocuments}
}