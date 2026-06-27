"use client"
import useUser from "../../lib/hook/useUser"
import Logout from "./Logout"
import Profile from "./Profile"
import Setting from "../Setting"
import ToggleThemeButton from "./ToggleThemeButton"
import Sidebar from "../Sidebar"

export default function Navbar() {
  const user = useUser()

  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      {/* Left — sidebar toggle & Brand */}
      <div className="flex items-center gap-3">
        <Sidebar />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">
          AI Research Assistant
        </span>
      </div>

      {/* Right — user actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {user.username && (
          <>
            <Setting />
            <Profile />
            <span className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1.5" />
            <Logout />
          </>
        )}
        <ToggleThemeButton />
      </div>
    </nav>
  )
}