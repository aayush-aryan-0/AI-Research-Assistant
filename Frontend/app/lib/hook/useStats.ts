// useActivity.ts
"use client"
import { useEffect, useState } from "react"
import api from "@/app/lib/api/api"

export type Stats = {
  total_projects:number,
  total_chats:number,
  total_chat_messages:number,
  total_documents:number
}

export default function useStats() {
  const [stats, setStats] = useState<Stats>()
  useEffect(() => {
    api.get(`/user/stats`).then(r => setStats(r.data)).catch(() => {})
  }, [])
  return stats
}