"use client"
import Upload from "./Upload"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import api from "@/app/lib/api/api"
import { isAxiosError } from "axios"

type Document = {
  id: string
  project_id: string
  filename: string
  file_path: string
  timestamp: string
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState<Array<Document>>([])
  const [error, setError] = useState<string>("")
  const { projectID } = useParams()

  useEffect(() => {
    async function loadDocuments() {
      setError("")
      try {
        const result = await api.get(`/project/${projectID}/documents/`)
        setDocuments(result.data)
      } catch (e) {
        if (isAxiosError(e)) console.log(e.cause)
        else console.error("Failed to load documents", e)
        setError("Failed to load documents")
      }
    }
    loadDocuments()
  }, [projectID])

  async function deleteDocument(documentID: string) {
    try {
      await api.delete(`/project/${projectID}/documents/`, {
        data: {document_id:documentID},
      })
      setDocuments((prev) => prev.filter((d) => d.id !== documentID))
    } catch (e) {
      if (isAxiosError(e)) console.log(e.cause)
      else console.error("Failed to delete document", e)
      setError("Failed to delete document")
    }
  }

  return (
    <div
        className="flex flex-col gap-2 w-lvw m-4"
    >
      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <Upload />
      <section>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600 mb-3">
          Documents
        </h2>
        {documents.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-600 text-center py-10">
            No documents yet. Upload one above.
          </p>
        ) : (
          <ul className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
            {documents.map((document) => (
              <li
                key={document.id}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <button
                  onClick={() => console.log("view", document.id)}
                  className="flex-1 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {document.filename}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-4 shrink-0">
                    {new Date(document.timestamp).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </button>
                <button
                  onClick={() => deleteDocument(document.id)}
                  className="ml-4 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 shrink-0 cursor-pointer"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}