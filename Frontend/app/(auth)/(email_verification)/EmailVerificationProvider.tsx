"use client"
import { useState,createContext,SetStateAction,Dispatch } from "react"

type EmailVerificationProviderContextType ={
    email:string,
    setEmail:Dispatch<SetStateAction<string>>,
    otp:string,
    setOtp:Dispatch<SetStateAction<string>>,
}
export const EmailVerificationProviderContext=createContext<EmailVerificationProviderContextType |null>(null);
export function EmailVerificationProvider({children,}: {children: React.ReactNode})
{
     const [email,setEmail]=useState<string>("");
     const [otp,setOtp]=useState<string>("")
     return(
        <EmailVerificationProviderContext.Provider value={{email,setEmail,otp,setOtp}}>
        {children}
        </EmailVerificationProviderContext.Provider>
     )

}
