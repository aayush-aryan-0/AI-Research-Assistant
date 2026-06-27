"use client"
import { useState } from "react"
import Setting from "./Setting"
import useProjects from "../lib/hook/useProjects"
import useChats from "../lib/hook/useChats"
import useDocuments from "../lib/hook/useDocuments"
import useProject from "../(protected)/lib/hooks/useProject"
import { useRouter } from "next/navigation"
import Dashboard from "./Dashboard"
import { ParamValue } from "next/dist/server/request/params"
import useChat from "../(protected)/lib/hooks/useChat"

function CollapsibleSection({ title, children, defaultOpen = true, indent = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean, indent?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={indent ? "pl-3 border-l border-gray-200 dark:border-gray-800 ml-2" : ""}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group"
      >
        <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          {title}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-screen mt-1" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { setProject } = useProject()
  const {projects} = useProjects()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center gap-1.5 w-9 h-9 p-2 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <span className="block h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded-full" />
        <span className="block h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded-full" />
        <span className="block h-0.5 w-full bg-gray-600 dark:bg-gray-400 rounded-full" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/20 dark:bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 flex flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-900 shrink-0">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Workspace
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          <Dashboard />

          {projects.length === 0 ? (
             <p className="text-sm text-center text-gray-400 dark:text-gray-600 mt-4">No projects yet.</p>
          ) : (
            <CollapsibleSection title="Projects">
              <ul className="space-y-1">
                {projects.map((project) => (
                  <li key={project.id}>
                    <button
                      onClick={() => { setProject(project); router.push(`/dashboard/project/${project.id}`); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors group cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                        {project.title}
                      </span>
                    </button>
                    <Chats projectID={project.id} />
                    <Uploads projectID={project.id} />
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}
          <Setting/>
        </div>
      </aside>
    </>
  )
}

function Chats({ projectID }: { projectID: ParamValue }) {
  const router = useRouter()
  const { setChat } = useChat()
  const {chats} = useChats(projectID)

  return (
    <CollapsibleSection title="Chats" defaultOpen={true} indent>
      {chats.length === 0 ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-600 px-2 py-1">Empty</p>
      ) : (
        <ul className="space-y-0.5 mt-1">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => { setChat(chat); router.push(`/dashboard/project/${projectID}/chat/${chat.id}`); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group"
              >
                <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 truncate flex-1 transition-colors">
                  {chat.title}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-600 shrink-0">
                  {new Date(chat.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </CollapsibleSection>
  )
}

function Uploads({ projectID }: { projectID: ParamValue }) {
  const { documents } = useDocuments(projectID)

  return (
    <CollapsibleSection title="Uploads" defaultOpen={false} indent>
      {documents.length === 0 ? (
        <p className="text-[11px] text-gray-400 dark:text-gray-600 px-2 py-1">Empty</p>
      ) : (
        <ul className="space-y-0.5 mt-1">
          {documents.map((document) => (
            <li key={document.id}>
              <button
                onClick={() => console.log("view", document.id)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer group"
              >
                <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 truncate flex-1 transition-colors">
                  {document.filename}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </CollapsibleSection>
  )
}