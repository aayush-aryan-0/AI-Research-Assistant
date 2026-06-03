"use client"
import { EmailVerificationProviderContext } from "./EmailVerificationProvider";
import { useContext } from "react";
export default function useEmailVerificationProvider(){
    const emailVerificationContextr=useContext(EmailVerificationProviderContext);
    if(emailVerificationContextr===null){
        throw Error("MUST USE INSIDE EmailVerificationProvider")
    }
    return emailVerificationContextr;
}