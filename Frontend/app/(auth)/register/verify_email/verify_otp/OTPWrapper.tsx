"use client"
import OTP from "@/app/(auth)/(email_verification)/(verifyOTP)/OTP"
import verifyOTP from "./verifyOTP"
export default function OTPWrapper(){
  return(
  
      <OTP redirectToPath="/login" api={verifyOTP}/>
    
  )
}