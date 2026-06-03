"use client"

import { useRouter } from "next/navigation"

export default  function Profile(){

    const router=useRouter();
    return(
        <button className="bg-purple-700 w-fit p-1.5
         text-white rounded-4xl font-bold shadow-lg text-shadow-2x cursor-pointer" 
        onClick={()=>router.push("/user/profile")}>
            Profile 
            </button>
                 
    )
}