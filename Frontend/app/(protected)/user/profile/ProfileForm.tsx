"use client"

import useUser from "@/app/lib/hook/useUser";
import UpdateAccountButton from "@/app/settings/UpdateAccoutButton";

export default function ProfileForm() {
    const user = useUser();
    
    const inputClass = "w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-800/80 disabled:cursor-not-allowed disabled:text-gray-600 dark:disabled:text-gray-400";
    const labelClass = "text-sm font-medium text-gray-500 dark:text-gray-400 ml-1";
    const fieldClass = "flex flex-col gap-1.5";

    return (
        <div className="flex flex-col gap-6 w-full max-w-md">
            <div className="flex flex-col gap-5 rounded-2xl w-full p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className={fieldClass}>
                    <label htmlFor="full-name" className={labelClass}>Name</label>
                    <input id="full-name" type="text" disabled value={user.full_name || ""} className={inputClass} />
                </div>

                <div className={fieldClass}>
                    <label htmlFor="username" className={labelClass}>Username</label>
                    <input id="username" type="text" disabled value={user.username || ""} className={inputClass} />
                </div>

                <div className={fieldClass}>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input id="email" type="email" disabled value={user.email || ""} className={inputClass} />
                </div>
            </div>
            
            <UpdateAccountButton /> 
        </div>
    )
}