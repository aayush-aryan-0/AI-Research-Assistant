import Link from "next/link";
import Register from "./Register";
export default function RegisterPage(){
  return(
      <div className="flex flex-col items-center gap-1.5 transition-colors duration-300">
      <span className="text-4xl font-bold">Register</span>
      <Register/>
      <span className="w-fit p-1.5 text-black dark:text-white font-bold">
        Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link> 
      </span>
    </div>
  )
}
