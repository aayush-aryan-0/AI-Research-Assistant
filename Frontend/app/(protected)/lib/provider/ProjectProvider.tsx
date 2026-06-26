"use client"
import { useState} from "react"
import Project from "@/app/(protected)/lib/type/Project.type";
import ProjectContext from "@/app/(protected)/lib/context/ProjectContext";

export default function ProjectProvider({children,}: {children: React.ReactNode})
{
     const [project,setProject]=useState<Project>({
        id:"",
        user_id:"",
        title:"",
        timestamp:""
     });
    
     return(
        <ProjectContext.Provider value={{project,setProject}}>
        {children}
        </ProjectContext.Provider>
     )

}
