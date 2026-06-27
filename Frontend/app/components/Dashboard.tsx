"use client"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  
  return (
    <button
      onClick={() => router.push("/dashboard")}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors group cursor-pointer"
    >
      <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        Dashboard
      </span>
    </button>
  )
}