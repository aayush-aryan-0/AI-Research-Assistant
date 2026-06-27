"use client"
import logoutRequest from "../../api/logoutRequest"
import { useRouter } from "next/navigation"

export default function Logout() {
  const router = useRouter()
  
  async function logout() {
    await logoutRequest()
    router.push("/login")
  }

  return (
    <button
      onClick={logout}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="hidden sm:inline">Log out</span>
    </button>
  )
}