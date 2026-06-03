"use client"

import { useState,useEffect } from "react";
import profileRequest from "@/app/api/profileRequest";
import User from "@/app/types/User.type";
import ProfileResponseProps from "@/app/types/ProfileResponse.type";

export default function useUser(){
    const [user,setUser]=useState<User>({
        username: "",
        full_name: "",
        email: "",
    });
    useEffect(()=>{
        (async()=>{
            const response:ProfileResponseProps=await profileRequest();
            if(response.success){
                setUser(response.profile);
            }
        })()

    },[])
    return user;
}