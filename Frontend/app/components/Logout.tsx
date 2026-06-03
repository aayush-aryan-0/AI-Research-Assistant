"use client"
import logoutRequest from "../api/logoutRequest"
import { useRouter } from "next/navigation";
export default  function Logout(){
    const router=useRouter();
    async function logout(){
        await logoutRequest();
        router.push("/login");
    }
  
    return(
       
        <button className="bg-red-700 w-fit p-1.5
                   text-white rounded-4xl font-bold
                   shadow-lg text-shadow-2x cursor-pointer" 
                    onClick={logout}>
                    Log-out
                  </button>
              
    )
}