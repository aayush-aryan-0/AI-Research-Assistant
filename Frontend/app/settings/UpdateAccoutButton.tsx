"use client"
import { useRouter } from "next/navigation"
export default function UpdateAccountButton(){
    const router=useRouter()
    return(
        <button
                    className="w-full text-left bg-blue-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3
                     text-lg font-medium text-gray-800
                     dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-500 
                     shadow-md dark:shadow-[#d2e9ea21] transition-colors duration-150 cursor-pointer"
                    onClick={() => router.push("/settings/update_credentials")}
                >
                    Update Account Details
                </button>
    )
}