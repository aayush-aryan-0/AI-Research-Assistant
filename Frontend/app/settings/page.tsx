"use client"
import { useRouter } from "next/navigation"
import ToggleThemeButton from "../components/Navbar/ToggleThemeButton";
import UpdateAccountButton from "./UpdateAccoutButton";
import Logout from "../components/Navbar/Logout";
export default function SettingsPage() {
    const router = useRouter()

    return (
       <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-950">
            <div className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl flex flex-col gap-6 p-6 sm:p-8">
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Settings
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your account preferences and details.
                    </p>
                </div>

                {/* General Settings */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-5 py-4">
                        <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                            Dark Mode
                        </span>
                        <ToggleThemeButton />
                    </div>

                    <UpdateAccountButton />
                </div>

                <hr className="border-gray-200 dark:border-gray-800 my-2" />

                {/* Danger Zone */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">
                        Danger Zone
                    </h2>
                    <Logout/>
                    <div className="border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-base font-medium text-gray-900 dark:text-gray-100">Delete Account</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Permanently remove your account and data.</span>
                        </div>
                        <button
                            className="whitespace-nowrap px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 cursor-pointer shadow-sm"
                            onClick={() => router.push("/settings/delete_account")}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}