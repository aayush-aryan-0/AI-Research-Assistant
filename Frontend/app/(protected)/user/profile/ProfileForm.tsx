"use client"

import useUser from "@/app/lib/hook/useUser";
import UpdateAccountButton from "@/app/settings/UpdateAccoutButton";
export default function ProfileForm(){
    const user=useUser();
     const inputClass = "w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-2xl text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";
    const fieldClass = "flex flex-col gap-1.5";

    return(
         
                <div className="flex flex-col gap-5">
                    <form
                           className="flex flex-col gap-4 rounded-xl w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md disabled:bg-gray-100 "
        >

            <div className={fieldClass}>
                <label htmlFor="full-name" className={labelClass}>Name</label>
                <input id="full-name" type="text" placeholder="Full Name" disabled
                    value={user.full_name} className={inputClass}
                  />
            </div>

            <div className={fieldClass}>
                <label htmlFor="username" className={labelClass}>Username</label>
                <input id="username" type="text" placeholder="Username" disabled
                    value={user.username} className={inputClass}
                     />
            </div>

            <div className={fieldClass}>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input id="email" type="email" placeholder="Email" disabled
                    value={user.email} className={inputClass} />
            </div>

            
            
            </form>
            <UpdateAccountButton/>
            </div>

  

        )
}