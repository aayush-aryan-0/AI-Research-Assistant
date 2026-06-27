"use client"
import DeleteUser from "./deleteUser.type";
import APIResponse from "@/app/types/APIResponse.types";
import deleteAccountRequest from "./deleteAccountRequest";
import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";

export default function DeletePage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    async function handleDelete() {
        setError("");

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        const payload: DeleteUser = { password };
        startTransition(async () => {
             const response: APIResponse = await deleteAccountRequest(payload);
            if (!response.success) {
                setError(response.response);
                return;
            }
            await signOut({
                    redirect: true,
                    callbackUrl: "/login"
            });
        })
    }

    const inputClass = "w-full rounded-lg px-3.5 py-2.5 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
            <form
                onSubmit={(e) => { e.preventDefault(); handleDelete(); }}
                className="flex flex-col gap-5 rounded-2xl w-full max-w-md p-6 sm:p-8 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/50 shadow-sm"
            >
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Delete Account
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        This action is permanent and cannot be undone. All your data will be erased.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="flex flex-col gap-1.5 mt-2">
                    <label htmlFor="delete-password" className={labelClass}>
                        Enter your password to confirm
                    </label>
                    <input
                        id="delete-password"
                        type="password"
                        required
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2.5 mt-2 bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                >
                   {isPending ? "Deleting..." : "Yes, Delete Permanently"} 
                </button>
            </form>
        </div>
    )
}