"use client"

import { useState,useEffect } from "react";
import Project from "@/app/(protected)/lib/type/Project.type";
import api from "../api/api";
import useError from "@/app/(protected)/lib/hooks/useError";
export default function useProjects(){
    const [projects, setProjects] = useState<Array<Project>>([])
    const {setError}=useError()
    useEffect(()=>{
        setError("");
        (async()=>{
            try {
                const result = await api.get(`project/get_all`)
                const projects:Array<Project>=result.data
                if(projects.length===0){
                  return
                }
                setProjects(result.data)
              } catch (e) {
                    console.error("Failed to load history", e)
                   setError("Failed to load projects")
              }
                })()

    },[setError])
    return {projects,setProjects};
}