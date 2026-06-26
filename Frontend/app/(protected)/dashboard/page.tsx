"use client"

import Welcome from "./Welcome";
import { useState, useEffect } from "react"
import { useTransition } from "react"
import { useRouter } from "next/navigation";
import api from "@/app/lib/api/api"
import { isAxiosError } from "axios";
import Project from "@/app/(protected)/lib/type/Project.type";
import useProject from "../lib/hooks/useProject";
type NewProject = {
  title: string
}

export default function DashboardPage() {
  const router = useRouter();
  const [isPending, setTransition] = useTransition()
  const [error, setError] = useState<string>("")
  const [projects, setProjects] = useState<Array<Project>>([])
  const [newProjectRequest, setNewProjectRequest] = useState<NewProject>({ title: "" })
  const {setProject}=useProject()
  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await api.get(`project/get_all`)
        setProjects(result.data)
      } catch (e) {
        console.error("Failed to load history", e)
        setError("Failed to load projects")
      }
    }
    loadHistory()
  }, [])

  async function newProject() {
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">

        {/* Header */}
        <header className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <Welcome />
        </header>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* New project */}
        <section>
          <form
            className="flex"
            onSubmit={(e) => { e.preventDefault(); newProject(); }}
          >
            <input
              type="text"
              placeholder="New project name…"
              value={newProjectRequest.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewProjectRequest({ title: e.target.value })
              }
              className="
                flex-1 bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-zinc-100
                placeholder-zinc-400 dark:placeholder-zinc-600
                border border-zinc-200 dark:border-zinc-800
                border-r-0
                rounded-l-lg
                px-4 py-2.5 text-sm
                outline-none
                focus:border-green-500 dark:focus:border-green-500
                transition-colors
              "
            />
            <button
              type="submit"
              disabled={isPending}
              className="
                bg-green-600 hover:bg-green-700
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white text-sm font-medium
                rounded-r-lg
                px-5 py-2.5
                flex items-center justify-center min-w-20
                transition-colors
              "
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Create"}
            </button>
          </form>
        </section>

        {/* Project list */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600 mb-3">
            Projects
          </h2>

          {projects.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-600 text-center py-10">
              No projects yet. Create one above.
            </p>
          ) : (
            <ul className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() =>{ 
                      setProject(project)
                      router.push(`/dashboard/project/${project.id}`)}}
                    className="
                      w-full flex items-center justify-between
                      px-4 py-3.5
                      text-left
                      hover:bg-zinc-50 dark:hover:bg-zinc-800/60
                      transition-colors
                      cursor-pointer
                    "
                  >
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {project.title}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-4 shrink-0">
                      {new Date(project.timestamp).toLocaleDateString(undefined, {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  )
}