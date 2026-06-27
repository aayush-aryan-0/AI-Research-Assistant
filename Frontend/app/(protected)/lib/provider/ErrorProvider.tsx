"use client";

import { useState } from "react";

import ErrorContext from "../context/ErrorContext";



export default function ErrorProvider({ children }: { children: React.ReactNode }) {

  const [error, setError] = useState<string>("");
 
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}
