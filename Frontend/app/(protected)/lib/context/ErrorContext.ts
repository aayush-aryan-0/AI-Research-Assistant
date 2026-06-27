import { createContext,Dispatch,SetStateAction } from "react";

type ErrorContext={
    error:string,
    setError: Dispatch<SetStateAction<string>>
}
const ErrorContext=createContext<ErrorContext|null>(null);


export default ErrorContext;