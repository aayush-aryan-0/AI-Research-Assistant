"use client"
import { useRouter } from "next/navigation"

export default function UpdateAccountButton() {
    const router = useRouter()
    
    return (
        <button
            className="group w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl px-5 py-4 text-left transition-all duration-200 cursor-pointer"
            onClick={() => router.push("/settings/update_credentials")}
        >
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                Update Account Details
            </span>
            <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                →
            </span>
        </button>
    )
}