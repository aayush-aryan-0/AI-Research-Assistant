"use client"
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import APIResponse from "@/app/types/APIResponse.types";
import sendEmailOTP from "./sendEmailOTP";
import useEmailVerificationProvider from "../useEmailVerificationProvider";
export default function Email({redirectToPath}:{redirectToPath:string}) {
    const router = useRouter();
    const {email, setEmail} = useEmailVerificationProvider();
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleSubmit() {
        setError("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        startTransition(async () => {
            const response: APIResponse = await sendEmailOTP(email);
            if (!response.success) {
                setError(response.response);
                return;
            }
            router.push(redirectToPath);
        });
    }

    const inputClass = "w-full  rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500";
    const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="flex flex-col gap-2"
        >
            

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-1.5">
                <label htmlFor="forgot-email" className={labelClass}>Email</label>
                <input
                    id="forgot-email"
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Sending..." : "Submit"}
            </button>
        </form>
    );
}