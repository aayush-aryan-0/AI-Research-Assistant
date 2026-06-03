"use client"
import { useState,useTransition} from "react";
import APIResponse from "@/app/types/APIResponse.types";
import UserUpdate from "./userUpdate.type";
import userUpdateRequest from "./updateRequest";
import { useRouter } from "next/navigation";
export default function UpdatePage() {
    const router=useRouter()
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending,startTransition]=useTransition();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userUpdate, setUserUpdate] = useState<UserUpdate>({
        current_password: "",
        new_username: null,
        new_full_name:null,
        new_email: null,
        new_password: null
    });

    function handleChange(field: keyof UserUpdate) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setUserUpdate(prev => ({ ...prev, [field]: e.target.value===""?null:e.target.value }));
    }

    async function updateUser() {
        setError("");

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
        startTransition(async ()=>{
            const response: APIResponse = await userUpdateRequest(userUpdate);
            if (!response.success) {
            setError(response.response);
            return;
            }
            setError("");
            setConfirmPassword("");
            setSuccess("USER UPDATED")
        })
        
    }

    const inputClass = "w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";
    const fieldClass = "flex flex-col gap-1.5";

    return (
        <div className="flex items-center justify-center ">
        <form
            onSubmit={(e) => { e.preventDefault(); updateUser(); }}
            className="flex flex-col gap-4 rounded-xl w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Update Account
            </h2>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-sm text-shadow-green-400 dark:text-shadow-green-400 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                    {success}
                </p>
            )}

            {/* Current password first — identity confirmation */}
            <div className={fieldClass}>
                <label htmlFor="current_password" className={labelClass}>Current Password</label>
                <input id="current_password" type="password" required placeholder="Current Password"
                    value={userUpdate.current_password}
                    onChange={handleChange("current_password")}
                    className={inputClass} />
                <span onClick={()=>router.push("/forgot")}
                    className="hover:underline text-blue-500 font-bold cursor-pointer"
                    >
                        forgot password?
                </span>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            <div className={fieldClass}>
                <label htmlFor="full-name" className={labelClass}>New Name</label>
                <input id="full-name" type="text" placeholder="Full Name"
                    value={userUpdate.new_full_name??""}
                    onChange={handleChange("new_full_name")}
                    className={inputClass} />
            </div>

            <div className={fieldClass}>
                <label htmlFor="username" className={labelClass}>New Username</label>
                <input id="username" type="text" placeholder="Username"
                    value={userUpdate.new_username??""}
                    onChange={handleChange("new_username")}
                    className={inputClass} />
            </div>

            <div className={fieldClass}>
                <label htmlFor="email" className={labelClass}>New Email</label>
                <input id="email" type="email" placeholder="Email"
                    value={userUpdate.new_email??""}
                    onChange={handleChange("new_email")}
                    className={inputClass} />
            </div>

            <div className={fieldClass}>
                <label htmlFor="password" className={labelClass}>New Password</label>
                <input id="password" type="password" minLength={8} placeholder="Password"
                    value={userUpdate.new_password??""}
                    onChange={handleChange("new_password")}
                    className={inputClass} />
            </div>

            <div className={fieldClass}>
                <label htmlFor="confirm-password" className={labelClass}>Confirm New Password</label>
                <input id="confirm-password" type="password" minLength={8} placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass} />
            </div>

            <button type="submit" disabled={isPending}
                className="w-full py-2 mt-2 bg-gray-900
                 dark:bg-gray-100 text-white
                  dark:text-gray-900 font-semibold
                   rounded-lg hover:opacity-90 transition-opacity
                    duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending?"Updating...":"Update"}
            </button>
        </form>
        </div>
    )
}