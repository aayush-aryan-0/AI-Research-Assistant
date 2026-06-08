
import OTPWrapper from "./OTPWrapper"
import Resend from "@/app/(auth)/(email_verification)/(sendEmailOTP)/Resend"

export default function ForgotPage(){
  return(
    <div  className="flex flex-col items-center justify-start
     gap-1.5 transition-colors duration-300">
      <OTPWrapper/>
      <span>Didn&apos;t get the OTP?</span>
      <Resend/>
    </div>
  )
}