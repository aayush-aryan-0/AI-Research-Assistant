"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useEffect,useRef } from "react"

export default function Google() {
    const { data: session } = useSession()
    const router = useRouter()

    async function callFastAPI(token: string) {
        try{
        const res = await fetch("/api/backend/auth/google", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        })
        if (!res.ok) {
            console.error(res)
            return
        }
        router.push("/home")}
        catch(error){console.error(error)}
    }
    const called = useRef(false)

  useEffect(() => {
    if (session?.id_token && !called.current) {
        called.current = true
        callFastAPI(session.id_token)
    }
}, [session])
    return (
        <div>
            <button
                onClick={() => signIn("google")}
                className="w-fit h-fit p-0.5 bg-transparent text-white font-bold rounded-full cursor-pointer hover:opacity-70"
            >
                <Image
                    className="block w-7.5 h-auto"
                    src="/google.svg"
                    alt="google"
                    width={30}
                    height={30}
                />
            </button>
        </div>
    )
}