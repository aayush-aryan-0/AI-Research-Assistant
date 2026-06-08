"use client"
import { useRouter } from "next/navigation"
import ToggleThemeButton from "../components/Navbar/ToggleThemeButton";
import UpdateAccountButton from "./UpdateAccoutButton";
export default function SettingsPage() {
    const router = useRouter()

    return (
       <div className="flex flex-col items-center justify-center min-h-svh  px-4">
            <div className="w-fit min-w-xl min-h-lvh bg-gray-100 dark:bg-gray-900 shadow-lg shadow-gray-400 dark:shadow-gray-100 rounded-xl flex flex-col gap-3  px-2">
                
                <h1 className="text-4xl font-semibold text-gray-700 dark:text-gray-100 m-2 ">
                    Settings
                </h1>

        
                <div className="flex items-center justify-between bg-black dark:bg-white shadow-md shadow-gray-400 dark:shadow-[#ffffff52] rounded-xl px-4 py-3">
                    <span className="text-lg font-medium  text-white dark:text-black">
                        Dark Mode
                    </span>
                    <ToggleThemeButton />
                </div>

                
                <UpdateAccountButton/>

                <div className="mt-4 dark:bg-gray-700 border-2 border-red-300 dark:border-red-900 shadow-md shadow-red-200 dark:shadow-[#fd0000] rounded-xl p-4">
                    <p className="text-lg font-semibold uppercase tracking-widest text-red-500 mb-3">
                        Danger Zone
                    </p>
                    <button
                        className="w-full text-left text-sl text-shadow-md  backdrop-blur-3xl text-red-600 font-semibold hover:text-red-900 dark:hover:text-red-100 transition-colors duration-150 cursor-pointer"
                        onClick={() => router.push("/settings/delete_account")}
                    >
                        Delete Account
                    </button>
                </div>

            </div>
        </div>
    )
}