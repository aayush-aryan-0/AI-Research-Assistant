import Link from "next/link";
import Login from "./Login";
import Google from "./Google";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 transition-colors duration-300 px-4 py-8">
      <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Login</span>

      <Login />
      
      <span className="mt-2">
        <Link href="/forgot" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
          Forgot password?
        </Link>
      </span>
      
      <span className="w-fit p-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
        Don&apos;t have an account? <Link href="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-500 transition-colors">Register</Link>
      </span>

      <span className="text-sm font-medium text-gray-400 dark:text-gray-500 my-2">
        --- or login with ---
      </span>
      
      <Google />
    </div>
  )
}