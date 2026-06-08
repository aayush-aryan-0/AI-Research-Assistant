"use client"

import { useRouter } from "next/navigation"
import Image from "next/image";
export default  function Setting(){

    const router=useRouter();
    return(
        <button className="bg-transparent
         text-white  font-bold shadow-lg hover:opacity-75 text-shadow-2xs drop-shadow-2xl
         cursor-pointer" 
        onClick={()=>router.push("/settings")}>
            <Image
            src="/settings.png"
            alt="Setting"
            width={30}
            height={30}
            />
            </button>
                 
    )
}