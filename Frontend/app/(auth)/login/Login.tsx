"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserLoginRequest from "./types/UserLoginRequest.type";
import APIResponse from "@/app/types/APIResponse.types";
import loginRequest from "./loginRequest";
import Error from "@/app/(protected)/lib/components/Error";

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

   const inputClass = "w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400";

    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 ml-1";
    return (
        <form
    onSubmit={(e) => { e.preventDefault(); checkLogin(); }} 
    className="flex flex-col gap-5 rounded-2xl w-full max-w-md p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none"
>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Log in
            </h2>

            <Error error={error}/>

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
    className="w-full py-3 mt-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 shadow-sm"
>
    Log in 
</button>
        </form>
    )
}