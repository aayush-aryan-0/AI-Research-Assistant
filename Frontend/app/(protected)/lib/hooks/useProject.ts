"use client"
import ProjectContext from "../context/ProjectContext";
import { useContext } from "react";
export default function useProject(){
    const projectContext=useContext(ProjectContext);
    if(projectContext===null){
        throw Error("MUST USE INSIDE project context provider")
    }
    return projectContext;
}