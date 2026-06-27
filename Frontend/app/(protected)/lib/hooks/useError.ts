"use client"
import ErrorContext from "../context/ErrorContext";
import { useContext } from "react";
export default function useError(){
    const errorContext=useContext(ErrorContext);
    if(errorContext===null){
        throw Error("MUST USE INSIDE error context provider")
    }
    return errorContext;
}