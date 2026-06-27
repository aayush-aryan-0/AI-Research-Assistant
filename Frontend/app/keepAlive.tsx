"use client"
import { useEffect } from "react"

export default function KeepAlive() {
  useEffect(() => {
    const ping = () => fetch('/api/backend/')
    ping()
    const interval = setInterval(ping, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  return null
}