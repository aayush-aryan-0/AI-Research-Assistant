"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import registrationRequest from "./registrationRequest";
import UserRegisterRequest from "./types/UserRegisterRequest.type";
import APIResponse from "@/app/types/APIResponse.types";
import Error from "@/app/(protected)/lib/components/Error";
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

    const inputClass = "w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder:text-gray-400";

    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 ml-1";
    return (
        <form
    onSubmit={(e) => { e.preventDefault(); checkRegistration(); }} // OR checkRegistration()
    className="flex flex-col gap-5 rounded-2xl w-full max-w-md p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none"
>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create an account
            </h2>

           <Error error={error}/>

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
    className="w-full py-3 mt-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 shadow-sm"
>
     Register
</button>
        </form>
    )
}