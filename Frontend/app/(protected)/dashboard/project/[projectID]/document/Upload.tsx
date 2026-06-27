"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import useError from "@/app/(protected)/lib/hooks/useError"
export default function Upload() {
  const router = useRouter()
  const [docId, setDocId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const {error, setError }= useError()
  const { projectID } = useParams();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    setDocId(null)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`http://localhost:8000/project/${projectID}/documents/upload`, {
        method: "POST", body: formData, credentials: "include",
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setDocId(data.filename)

    } catch {
      setError("Upload failed. Please try again.")
    } finally {
      router.refresh()
      window.location.reload()
      setUploading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl px-4 py-3">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {docId && (
        <div className="flex items-center gap-2.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Document uploaded successfully
          </span>
        </div>
      )}

      <label className={`
        group flex flex-col items-center justify-center gap-3
        border-2 border-dashed rounded-xl px-6 py-12 cursor-pointer
        transition-all duration-200 bg-white dark:bg-gray-900
        ${uploading
          ? "border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed"
          : "border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
        }
      `}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-10 h-10 transition-colors duration-200 ${uploading ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <div className="text-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            {uploading ? "Uploading securely..." : "Click to upload a document"}
          </span>
          {!uploading && (
            <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
              PDF or DOCX
            </span>
          )}
        </div>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  )
}