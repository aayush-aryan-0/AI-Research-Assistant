"use client"

import Welcome from "./Welcome";
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation";
import api from "@/app/lib/api/api"
import { isAxiosError } from "axios";
import useProjects from "@/app/lib/hook/useProjects";
import useProject from "../lib/hooks/useProject";
import useStats from "@/app/lib/hook/useStats";
import useActivity from "@/app/lib/hook/useActivity";
import { ActivityItem } from "@/app/lib/hook/useActivity"
import useError from "../lib/hooks/useError";
import Error from "../lib/components/Error";
type NewProject = {
  title: string
}

const ACTIVITY_ICONS: Record<ActivityItem["type"], React.ReactNode> = {
  project_created: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  ),
  document_uploaded: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  chat_started: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-4.03 7-9 7a9.77 9.77 0 01-4-.83L3 19l1.06-3.37A6.96 6.96 0 013 12c0-3.866 4.03-7 9-7s9 3.134 9 7z" />
    </svg>
  ),
}

const ACTIVITY_COLORS: Record<ActivityItem["type"], string> = {
  project_created: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30",
  document_uploaded: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30",
  chat_started: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30",
}

export default function DashboardPage() {
  const router = useRouter();
  const [isPending, setTransition] = useTransition()
  const {error,setError}=useError()

  const [newProjectRequest, setNewProjectRequest] = useState<NewProject>({ title: "" })
  const { setProject } = useProject()
  const { projects, setProjects } = useProjects()
  const stats = useStats()
  const activity = useActivity()

  async function deleteProject(projectID: string) {
    try {
      await api.delete(`/project/`, {
        data: { project_id: projectID },
      })
      setProjects((prev) => prev.filter((d) => d.id !== projectID))
      router.refresh()
      window.location.reload();
    } catch (e) {
      if (isAxiosError(e)) console.log(e.cause)
      else console.error("Failed to delete project", e)
      setError("Failed to delete Project")
    }
  }

  async function newProject() {
    setError("");
    if (!newProjectRequest.title.trim()) return;

    setTransition(async () => {
      try {
        const result = await api.post(`/project/new`, newProjectRequest)
        setProject(result.data)
        router.push(`dashboard/project/${result.data.id}`)
      } catch (error: unknown) {
        if (isAxiosError(error))
          console.log(error.response?.data?.detail)
        else
          console.log(error)
        setError("Something went wrong")
      }
    })
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
      
      {/* Header */}
      <header className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <Welcome />
            </header>

      {/* Error */}
      <Error error={error}/>

      {/* Stats */}
      {stats && (
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-3">
            Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Projects", value: stats.total_projects },
              { label: "Documents", value: stats.total_documents },
              { label: "Chats", value: stats.total_chats },
              { label: "Messages", value: stats.total_chat_messages },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl px-4 py-3.5 flex flex-col gap-1"
              >
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New project */}
      <section>
        <form
          className="flex shadow-sm rounded-lg"
          onSubmit={(e) => { e.preventDefault(); newProject(); }}
        >
          <input
            type="text"
            placeholder="New project name…"
            value={newProjectRequest.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewProjectRequest({ title: e.target.value })
            }
            className="flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 border-r-0 rounded-l-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={isPending || !newProjectRequest.title.trim()}
            className="bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-gray-900 text-sm font-medium rounded-r-lg px-5 py-2.5 flex items-center justify-center min-w-25 transition-colors cursor-pointer"
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : "Create Project"}
          </button>
        </form>
      </section>

      {/* Project list */}
      <section>
        <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-3">
          Your Projects
        </h2>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No projects yet. Create one above to get started.
            </p>
          </div>
        ) : (
          <ul className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 shadow-sm">
            {projects.map((project) => (
              <li key={project.id} className="w-full flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <button
                  onClick={() => {
                    setProject(project)
                    router.push(`/dashboard/project/${project.id}`)
                  }}
                  className="flex-1 flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {project.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-4 shrink-0">
                    {new Date(project.timestamp).toLocaleDateString(undefined, {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </span>
                </button>
                
                <button
                  onClick={() => deleteProject(project.id)}
                  className="mr-4 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                  aria-label="Delete project"
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

      {/* Activity feed */}
      {activity.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-3">
            Recent Activity
          </h2>
          <ul className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 shadow-sm">
            {activity.map((item, i) => (
              <li key={i} className="flex items-center gap-3.5 px-5 py-3.5">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ACTIVITY_COLORS[item.type]}`}>
                  {ACTIVITY_ICONS[item.type]}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
                  {item.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  {new Date(item.timestamp).toLocaleDateString(undefined, {
                    month: "short", day: "numeric"
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  )
}