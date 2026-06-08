"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserLoginRequest from "./types/UserLoginRequest.type";
import APIResponse from "@/app/types/APIResponse.types";
import loginRequest from "./loginRequest";

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [userLoginRequest, setValue] = useState<UserLoginRequest>({
        username: "",
        password: ""
    });

    function handleChange(field: keyof UserLoginRequest) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(prev => ({ ...prev, [field]: e.target.value }));
    }

    async function checkLogin() {
        setError("");

        if (!userLoginRequest.username.trim() || !userLoginRequest.password.trim()) {
            setError("Enter username and password.");
            return;
        }

        const response: APIResponse = await loginRequest(userLoginRequest);
        if (!response.success) {
            setError(response.response);
            return;
        }

        router.push("/dashboard");
    }

    const inputClass = "w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); checkLogin(); }}
            className="flex flex-col gap-4 rounded-xl w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Log in
            </h2>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="login-username" className={labelClass}>Username</label>
                <input id="login-username" type="text" required placeholder="Username"
                    value={userLoginRequest.username}
                    onChange={handleChange("username")}
                    className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="login-password" className={labelClass}>Password</label>
                <input id="login-password" type="password" required placeholder="Password"
                    value={userLoginRequest.password}
                    onChange={handleChange("password")}
                    className={inputClass} />
            </div>

            <button type="submit"
                className="w-full py-2 mt-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity duration-150 cursor-pointer">
                Log in
            </button>
        </form>
    )
}