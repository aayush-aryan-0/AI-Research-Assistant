"use client"
import { useRouter } from "next/navigation"

import useUser from "../lib/hook/useUser"
import Logout from "./Logout"
import Profile from "./Profile"
import Setting from "./Setting"
import ToggleThemeButton from "./ToggleThemeButton"
import Sidebar from "./Sidebar"
export default function Navbar() {
    const router = useRouter()
    const user = useUser()

    return (
        <nav className="flex flex-row items-center justify-between px-6 py-3 bg-purple-400  shadow-md border-b border-gray-200 dark:border-gray-800">
            <ul className="flex flex-row-reverse items-center gap-4">
              
              <li>
                <button
                    onClick={() => router.push("/home")}
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100
                    bg-white dark:bg-gray-900  rounded-full p-2 text-shadow-2xs shadow-lg
                     tracking-tight  dark:text-shadow-gray-200 cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <Sidebar/>
              </li>
            
            </ul>
            

            <ul className="flex flex-row items-center gap-4">
                {user.username && (
                    <>
                        <li><Logout /></li>
                        <li><Profile /></li>
                        <li><Setting /></li>
                    </>
                )}
                <li><ToggleThemeButton /></li>
            </ul>
        </nav>
    )
}