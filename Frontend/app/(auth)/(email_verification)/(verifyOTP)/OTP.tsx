"use client"
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import APIResponse from "@/app/types/APIResponse.types";
import useEmailVerificationProvider from "../useEmailVerificationProvider";
type OTPtype={
    redirectToPath:string,
    api:(email:string,otp:string)=>Promise<APIResponse>
}
export default function OTP({redirectToPath,api}:OTPtype) {
    const router = useRouter();
    const { email, setEmail, otp, setOtp } = useEmailVerificationProvider();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleSubmit() {
        setError("");

        if (!otp.trim() || otp.trim().length !== 6) {
            setError("Enter the 6-digit code.");
            return;
        }

        startTransition(async () => {
            const response: APIResponse = await api(email, otp);
            if (!response.success) {
                setError(response.response);
                return;
            }
            setEmail("");
            setOtp("");
            setSuccess("Use Updated")
            router.push(redirectToPath)
        });
    }

    const inputClass = "w-full rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 tracking-widest text-center text-lg";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="flex flex-col gap-4 rounded-xl w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
        >
            <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Enter verification code
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    A 6-digit code was sent to {email || "your email"}.
                </p>
            </div>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                    {success}
                </p>
            )}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="otp" className={labelClass}>One-time password</label>
                <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    minLength={6}
                    maxLength={6}
                    required
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={inputClass}
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Verifying..." : "Verify"}
            </button>
        </form>
    );
}