"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
export default function Upload() {
  const [docId, setDocId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const {projectID}=useParams();
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`http://localhost:8000/project/${projectID}/documents/upload`, {
        method: "POST", body: formData,credentials: "include",
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setDocId(data.filename)
    } catch (e) {
      setError("Upload failed. Try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className=" bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">

        <header className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload</h1>
        </header>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <label className={`
          flex flex-col items-center justify-center gap-3
          border-2 border-dashed rounded-lg px-6 py-12 cursor-pointer
          transition-colors
          ${uploading
            ? "border-zinc-300 dark:border-zinc-700 opacity-50 cursor-not-allowed"
            : "border-zinc-300 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500"
          }
        `}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {uploading ? "Uploading…" : "Click to upload a PDF or DOCX"}
          </span>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {docId && (
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="text-sm text-green-700 dark:text-green-400">Document uploaded</span>
          </div>
        )}

      </div>
    </div>
  )
}