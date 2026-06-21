"use client"

import { ParamValue } from "next/dist/server/request/params";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api/api";
import { isAxiosError } from "axios";
type Chat = {
  id: string,
  project_id: ParamValue,
  title: string,
  timestamp: string
}

export default function ProjectPage() {
  const router = useRouter()
  const { projectID } = useParams()
  const [isPending, setTransition] = useTransition()
  const [error, setError] = useState<string>("")
  const [newChatRequest, setNewChatRequest] = useState({ title: "" })
  const [chats, setChats] = useState<Array<Chat>>([])

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await api.get(`project/${projectID}/chat/get_all`)
        setChats(result.data)
      } catch (e) {
        console.error("Failed to load history", e)
        setError("Failed to load chats")
      }
    }
    loadHistory()
  }, [projectID])

  async function newChat() {
    setTransition(async () => {
      try {
        const result = await api.post(`/project/${projectID}/chat/new_chat`, newChatRequest)
        router.push(`/dashboard/project/${projectID}/chat/${result.data.id}`)
      } catch (error:unknown) {
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* New chat */}
        <section>
          <form
            className="flex"
            onSubmit={(e) => { e.preventDefault(); newChat() }}
          >
            <input
              type="text"
              placeholder="New chat name…"
              value={newChatRequest.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewChatRequest({ title: e.target.value })
              }
              className="
                flex-1 bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-zinc-100
                placeholder-zinc-400 dark:placeholder-zinc-600
                border border-zinc-200 dark:border-zinc-800 border-r-0
                rounded-l-lg px-4 py-2.5 text-sm
                outline-none focus:border-green-500 dark:focus:border-green-500
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
                rounded-r-lg px-5 py-2.5
                flex items-center justify-center min-w-20
                transition-colors
                cursor-pointer
              "
            >
              {isPending
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : "Create"
              }
            </button>
             <button
            type="button"
            onClick={()=>router.push(`/dashboard/project/${projectID}/document`)}
            className="
              bg-gray-600 hover:bg-gray-700
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white text-sm font-medium
              rounded-r-lg px-5 py-2.5
              flex items-center justify-center min-w-20
              transition-colors
            "
          >
           Go To Documents
          </button>
          </form>
        </section>

        {/* Chat list */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600 mb-3">
            Chats
          </h2>

          {chats.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-600 text-center py-10">
              No chats yet. Create one above.
            </p>
          ) : (
            <ul className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <button
                    onClick={() => router.push(`/dashboard/project/${projectID}/chat/${chat.id}`)}
                    className="
                      w-full flex items-center justify-between
                      px-4 py-3.5 text-left
                      hover:bg-zinc-50 dark:hover:bg-zinc-800/60
                      transition-colors
                      cursor-pointer
                    "
                  >
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {chat.title}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-4 shrink-0">
                      {new Date(chat.timestamp).toLocaleDateString(undefined, {
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