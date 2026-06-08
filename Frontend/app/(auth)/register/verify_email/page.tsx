
import Email from "../../(email_verification)/(sendEmailOTP)/Email"
export default function ForgotPage(){
  return(
    <div className="flex items-center justify-center "> 
      <div className="flex flex-col gap-4 rounded-xl w-full max-w-md p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Verify Email?
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter your email and we&apos;ll send you a verification code.
          </p>
          <Email redirectToPath="register/verify_email/verify_otp"/>
      </div>

    </div>
    
  
  )
}