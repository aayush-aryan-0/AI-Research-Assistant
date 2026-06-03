"use client"
import useUser from "@/app/lib/hook/useUser";

export default function Welcome() {
    const user = useUser();

    if (!user.username) return null;

    return (
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            Welcome, {user.full_name}
        </h1>
    );
}