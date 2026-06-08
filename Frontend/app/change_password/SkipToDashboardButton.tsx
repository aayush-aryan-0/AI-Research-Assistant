"use client"
import { useRouter } from "next/navigation"
export default function SkipToDashboardButton() {
   const router=useRouter();
    return (
        
        <button onClick={()=>router.push("/dashboard")}
                className="w-fit  p-2 mt-2 bg-gray-600
                 dark:bg-gray-300 text-white
                  dark:text-gray-900 font-semibold
                   rounded-lg hover:opacity-90 transition-opacity shadow-md
                    duration-150 cursor-pointer ">
                Skip
            </button>

    )
}