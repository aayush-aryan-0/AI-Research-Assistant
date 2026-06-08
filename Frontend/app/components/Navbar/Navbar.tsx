"use client"

import useUser from "../../lib/hook/useUser"
import Logout from "./Logout"
import Profile from "./Profile"
import Setting from "./Setting"
import ToggleThemeButton from "./ToggleThemeButton"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
export default function Navbar() {

    const user = useUser()

    return (
        <nav className="flex flex-row items-center justify-between px-6 py-3 bg-purple-400  shadow-md border-b border-gray-200 dark:border-gray-800">
            <ul className="flex flex-row-reverse items-center gap-4">
              <li><Dashboard/></li>
              <li><Sidebar/></li>
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