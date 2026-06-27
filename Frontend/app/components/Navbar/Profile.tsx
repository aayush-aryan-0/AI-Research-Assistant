"use client"
import { useRouter } from "next/navigation"
import useUser from "@/app/lib/hook/useUser"

export default function Profile() {
  const router = useRouter()
  const user = useUser()

  return (
    <button
      onClick={() => router.push("/user/profile")}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
      aria-label="Profile"
    >
      {user?.username ? user.username[0].toUpperCase() : "?"}
    </button>
  )
}