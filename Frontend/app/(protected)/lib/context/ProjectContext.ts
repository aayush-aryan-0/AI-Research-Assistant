import { createContext,Dispatch,SetStateAction } from "react";
import Project from "@/app/(protected)/lib/type/Project.type";
type ProjectContext={
    project:Project,
    setProject: Dispatch<SetStateAction<Project>>
}
const ProjectContext=createContext<ProjectContext|null>(null);


export default ProjectContext;