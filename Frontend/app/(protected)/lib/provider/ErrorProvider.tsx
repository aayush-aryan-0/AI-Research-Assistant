"use client";

import { useState, useEffect } from "react";

import ErrorContext from "../context/ErrorContext";



export default function ErrorProvider({ children }: { children: React.ReactNode }) {
  // Safe initialization prevents Next.js server-side hydration errors
  const [error, setError] = useState<string>("");

 
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}
