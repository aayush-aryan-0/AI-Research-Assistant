"use client"
import { useState, useTransition } from "react";
import APIResponse from "@/app/types/APIResponse.types";
import UserUpdate from "./userUpdate.type";
import userUpdateRequest from "./updateRequest";
import { useRouter } from "next/navigation";

export default function UpdatePage() {
    const router = useRouter()
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, startTransition] = useTransition();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userUpdate, setUserUpdate] = useState<UserUpdate>({
        current_password: "",
        new_username: null,
        new_full_name: null,
        new_email: null,
        new_password: null
    });

    function handleChange(field: keyof UserUpdate) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setUserUpdate(prev => ({ ...prev, [field]: e.target.value === "" ? null : e.target.value }));
    }

    async function updateUser() {
        setError("");
        setSuccess("");

        if (!userUpdate.current_password.trim()) {
            setError("Current password is required.");
            return;
        }
        const hasAnyNewField = userUpdate.new_username?.trim() || userUpdate.new_full_name?.trim() ||
            userUpdate.new_email?.trim() || userUpdate.new_password?.trim();
        if (!hasAnyNewField) {
            setError("Update at least one field.");
            return;
        }
        
        if (userUpdate.new_password) {
            const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
            if (!validPassword.test(userUpdate.new_password)) {
                setError("Password must be 8+ characters with uppercase, lowercase, number, and special character.");
                return;
            }
            if (userUpdate.new_password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
        }
        startTransition(async () => {
            const response: APIResponse = await userUpdateRequest(userUpdate);
            if (!response.success) {
                setError(response.response);
                return;
            }
            setError("");
            setConfirmPassword("");
            setSuccess("Account details updated successfully.")
        })
    }

    const inputClass = "w-full rounded-lg px-3.5 py-2.5 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";
    const fieldClass = "flex flex-col gap-1.5";

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-950">
            <form
                onSubmit={(e) => { e.preventDefault(); updateUser(); }}
                className="flex flex-col gap-5 rounded-2xl w-full max-w-md p-6 sm:p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Update Account
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Make changes to your profile information below.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-lg p-3">
                        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                    </div>
                )}

                {/* Current password first — identity confirmation */}
                <div className={fieldClass}>
                    <div className="flex items-center justify-between">
                        <label htmlFor="current_password" className={labelClass}>Current Password <span className="text-red-500">*</span></label>
                        <button type="button" onClick={() => router.push("/forgot")} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            Forgot password?
                        </button>
                    </div>
                    <input id="current_password" type="password" required placeholder="Enter current password"
                        value={userUpdate.current_password}
                        onChange={handleChange("current_password")}
                        className={inputClass} />
                </div>

                <hr className="border-gray-200 dark:border-gray-800 my-2" />

                <div className={fieldClass}>
                    <label htmlFor="full-name" className={labelClass}>New Name</label>
                    <input id="full-name" type="text" placeholder="Full name"
                        value={userUpdate.new_full_name ?? ""}
                        onChange={handleChange("new_full_name")}
                        className={inputClass} />
                </div>

                <div className={fieldClass}>
                    <label htmlFor="username" className={labelClass}>New Username</label>
                    <input id="username" type="text" placeholder="user_name"
                        value={userUpdate.new_username ?? ""}
                        onChange={handleChange("new_username")}
                        className={inputClass} />
                </div>

                <div className={fieldClass}>
                    <label htmlFor="email" className={labelClass}>New Email</label>
                    <input id="email" type="email" placeholder="user@example.com"
                        value={userUpdate.new_email ?? ""}
                        onChange={handleChange("new_email")}
                        className={inputClass} />
                </div>

                <div className={fieldClass}>
                    <label htmlFor="password" className={labelClass}>New Password</label>
                    <input id="password" type="password" minLength={8} placeholder="8+ characters"
                        value={userUpdate.new_password ?? ""}
                        onChange={handleChange("new_password")}
                        className={inputClass} />
                </div>

                <div className={fieldClass}>
                    <label htmlFor="confirm-password" className={labelClass}>Confirm New Password</label>
                    <input id="confirm-password" type="password" minLength={8} placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClass} />
                </div>

                <button type="submit" disabled={isPending}
                    className="w-full py-2.5 mt-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isPending ? "Updating..." : "Save Changes"}
                </button>
            </form>
        </div>
    )
}