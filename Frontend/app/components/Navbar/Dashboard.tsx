"use client"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const router = useRouter()


    return (
      
                <button
                    onClick={() => router.push("/dashboard")}
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100
                    bg-white dark:bg-gray-900  rounded-full p-2 text-shadow-2xs shadow-lg
                     tracking-tight  dark:text-shadow-gray-200 cursor-pointer"
                >
                  Dashboard
                </button>
            
    )
}

