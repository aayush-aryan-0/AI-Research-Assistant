"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import registrationRequest from "./registrationRequest";
import UserRegisterRequest from "./types/UserRegisterRequest.type";
import APIResponse from "@/app/types/APIResponse.types";

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userRegisterRequest, setValue] = useState<UserRegisterRequest>({
        username: "",
        full_name: "",
        email: "",
        password: "",
    });

    function handleChange(field: keyof UserRegisterRequest) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(prev => ({ ...prev, [field]: e.target.value }));
    }

    async function checkRegistration() {
        setError("");

        const { username, password, full_name, email } = userRegisterRequest;

        if (!username.trim() || !password.trim() || !full_name.trim() || !email.trim()) {
            setError("All fields are required.");
            return;
        }

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validEmail.test(email)) {
            setError("Enter a valid email address.");
            return;
        }

        const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!validPassword.test(password)) {
            setError("Password must be 8+ characters with uppercase, lowercase, number, and special character.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const response: APIResponse = await registrationRequest(userRegisterRequest);
        if (!response.success) {
            setError(response.response);
            return;
        }

        router.push("/login");
    }

    const inputClass = "w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); checkRegistration(); }}
            className="flex flex-col gap-4 rounded-xl w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create an account
            </h2>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="full-name" className={labelClass}>Name</label>
                <input id="full-name" type="text" required placeholder="Full Name"
                    value={userRegisterRequest.full_name}
                    onChange={handleChange("full_name")}
                    className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="username" className={labelClass}>Username</label>
                <input id="username" type="text" required placeholder="Username"
                    value={userRegisterRequest.username}
                    onChange={handleChange("username")}
                    className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className={labelClass}>Email</label>
                <input id="email" type="email" required placeholder="Email"
                    value={userRegisterRequest.email}
                    onChange={handleChange("email")}
                    className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className={labelClass}>Password</label>
                <input id="password" type="password" required minLength={8}
                    placeholder="Password"
                    value={userRegisterRequest.password}
                    onChange={handleChange("password")}
                    className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-password" className={labelClass}>Confirm Password</label>
                <input id="confirm-password" type="password" required minLength={8}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass} />
            </div>

            <button type="submit"
                className="w-full py-2 mt-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity duration-150 cursor-pointer">
                Register
            </button>
        </form>
    )
}