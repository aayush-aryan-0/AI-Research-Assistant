"use client"
import DeleteUser from "./deleteUser.type";
import APIResponse from "@/app/types/APIResponse.types";
import deleteAccountRequest from "./deleteAccountRequest";
import { useState,useTransition } from "react";

import { signOut } from "next-auth/react";
export default function DeletePage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const[isPending,startTransition]=useTransition();
async function handleDelete() {
        setError("");

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        const payload: DeleteUser = { password };
        startTransition(async ()=>{
             const response: APIResponse = await deleteAccountRequest(payload);
            if (!response.success) {
                setError(response.response);
                return;
            }
            await signOut({
                    redirect: true,
                    callbackUrl: "/login"
            });
           // alert("account deleted successfully");
        })

        
       
    }

    const inputClass = "w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex items-center justify-center ">
        <form
            onSubmit={(e) => { e.preventDefault(); handleDelete(); }}
            className="flex flex-col gap-4 rounded-xl w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900 shadow-sm"
        >
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Delete Account
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This action is permanent and cannot be undone.
                </p>
            </div>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="delete-password" className={labelClass}>
                    Enter your password to confirm
                </label>
                <input
                    id="delete-password"
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 bg-red-600 hover:bg-red-700
           
                 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed
                rounded-lg transition-colors duration-150 cursor-pointer"
            >
               {isPending?"Deleting...":"Yes, Delete Permanently"} 
            </button>
        </form>
        </div>
    )
}