import Link from "next/link";
import Login from "./Login";
import Google from "./Google";
export default function LoginPage(){
  return(
     <div className="flex flex-col items-center justify-start gap-1.5 transition-colors duration-300">
    <span className="text-4xl font-bold">Login</span>

      <Login/>
      <span><Link href="/forgot" className="hover:underline text-blue-500 font-bold">Fogot password?</Link></span>
      <span  className="w-fit p-1.5 text-black dark:text-white font-bold">
        Don&apos;t have an account? <Link href="/register" className="text-blue-500 hover:underline">Register</Link> 
      </span>

      <span className="text-gray-400 dark:text-gray-500">
        ---or login with---
      </span>
      <Google/>
    </div>
  )
}