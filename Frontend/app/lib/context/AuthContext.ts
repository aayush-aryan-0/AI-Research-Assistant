import { createContext } from "react";
import User from "@/app/types/User.type";
type AuthContext={
    user:User
}


const AuthContex=createContext<AuthContext|null>(null);


export default AuthContex;