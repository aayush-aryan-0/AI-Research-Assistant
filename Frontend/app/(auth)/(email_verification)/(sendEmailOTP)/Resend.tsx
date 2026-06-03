"use client"
import APIResponse from "@/app/types/APIResponse.types";
import sendEmailOTP from "./sendEmailOTP";
import useEmailVerificationProvider from "../useEmailVerificationProvider";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export default function Resend(){
    const {email,setOtp}=useEmailVerificationProvider();
    const router=useRouter()

    const[isPending,setTransition]=useTransition();
    async function resendOTP() {
        setTransition(async ()=>{
        const response:APIResponse=await sendEmailOTP(email);
        if(!response.success){
          alert(response.response);
          return;
        }
        setOtp("");
        router.refresh()
        })
    }
  return(

     <button onClick={resendOTP}
                disabled={isPending}
                className=" p-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg 
                hover:opacity-90 transition-opacity duration-150 
                cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Sending..." : " Resend OTP"}
        </button>
   
     
  
  )
}