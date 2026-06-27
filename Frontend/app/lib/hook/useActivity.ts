// useActivity.ts
"use client"
import { useEffect, useState } from "react"
import api from "@/app/lib/api/api"

export type ActivityItem = {
  type: "project_created" | "document_uploaded" | "chat_started"
  label: string
  timestamp: string
}

export default function useActivity() {
  const [activity, setActivity] = useState<ActivityItem[]>([])
  useEffect(() => {
    api.get(`user/activity`).then(r => setActivity(r.data)).catch(() => {})
  }, [])
  return activity
}