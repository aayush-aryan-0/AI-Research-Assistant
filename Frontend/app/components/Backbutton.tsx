"use client"
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center
             gap-1.5 text-sm font-medium
             w-fit
             bg-gray-200
              text-gray-700 dark:text-gray-200
              dark:bg-gray-600 shadow-lg shadow-gray-300 dark:shadow-md
              dark:shadow-[#ffffff2a]
               hover:text-gray-100 dark:hover:text-gray-700 
               transition-colors duration-150 cursor-pointer 
               px-3 py-2 rounded-lg hover:bg-gray-500
                dark:hover:bg-gray-200"
        >
            ← Back
        </button>
    )
}