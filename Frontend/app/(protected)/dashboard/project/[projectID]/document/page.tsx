"use client"
import Upload from "./Upload"
import { useParams } from "next/navigation"
import api from "@/app/lib/api/api"
import { isAxiosError } from "axios"
import ProjectTitle from "@/app/(protected)/lib/components/ProjectTitle"
import Error from "@/app/(protected)/lib/components/Error"
import useDocuments from "@/app/lib/hook/useDocuments"
import useError from "@/app/(protected)/lib/hooks/useError"
export default function DocumentPage() {
  const {error, setError} = useError()
  setError("")
  const { projectID } = useParams()
  const { documents, setDocuments } = useDocuments(projectID)

  async function deleteDocument(documentID: string) {
    try {
      setError("")
      await api.delete(`/project/${projectID}/documents/`, {
        data: { document_id: documentID },
      })
      setDocuments((prev) => prev.filter((d) => d.id !== documentID))
    } catch (e) {
      if (isAxiosError(e)) console.log(e.cause)
      else console.error("Failed to delete document", e)
      setError("Failed to delete document")
    }
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
      {/* Header */}
      <ProjectTitle />

      <Error error={error} />
      
      <Upload />

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">
          Project Documents
        </h2>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No documents yet. Upload one above to get started.
            </p>
          </div>
        ) : (
          <ul className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 shadow-sm">
            {documents.map((document) => (
              <li
                key={document.id}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <button
                  onClick={() => console.log("view", document.id)}
                  className="flex-1 flex items-center gap-3.5 text-left cursor-pointer"
                >
                  {/* Document Icon */}
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {document.filename}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(document.timestamp).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => deleteDocument(document.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                  aria-label="Delete document"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}