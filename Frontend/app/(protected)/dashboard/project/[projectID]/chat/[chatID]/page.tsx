"use client"

import { useState, useEffect } from "react"
import { useTransition } from "react"
import { useParams } from "next/navigation"
import { ParamValue } from "next/dist/server/request/params"
import api from "@/app/lib/api/api"
import { useRouter } from "next/navigation"
type ChatMessage = {
  message: string,
  chat_id: ParamValue,
  role: string,
  timestamp: string
}

export default function ChatPage() {
  const router=useRouter()
  const [isPending, setTransition] = useTransition()
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [chatMessages, setChatMessages] = useState<Array<ChatMessage>>([])
  const { projectID, chatID } = useParams()

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await api.get(`project/${projectID}/chat/${chatID}/message/get_all`)
        setChatMessages(result.data)
      } catch (e) {
        console.error("Failed to load history", e)
      }
    }
    loadHistory()
  }, [chatID, projectID])

  async function handleStream(newMessages: ChatMessage) {
    setTransition(async () => {
      const response = await fetch(
        `http://localhost:8000/project/${projectID}/chat/${chatID}/message/prompt`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessages)
        }
      )

      if (!response.ok){ 
        
        console.log(response)
        
        throw new Error("Request failed")

      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let aiChat = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        aiChat += chunk
        setOutput((prev) => prev + chunk)
      }

      setChatMessages((prev) => [
        ...prev,
        {
          message: aiChat,
          role: "assistant",
          chat_id: chatID,
          timestamp: new Date().toISOString()
        },
      ])
      setOutput("")
    })
  }

  async function sendMessage() {
    try {
      if (!input.trim()) return
      const newMessages: Array<ChatMessage> = [
        ...chatMessages,
        {
          message: input,
          role: "user",
          chat_id: chatID,
          timestamp: new Date().toISOString()
        },
      ]
      setChatMessages(newMessages)
      setInput("")
      await handleStream(newMessages[newMessages.length-1])
    } catch (error: unknown) {
      setError(String(error))
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">

      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 font-semibold text-lg">
        Chat
      </div>

      {/* Error */}
      {error && (
        <div className="shrink-0 mx-6 mt-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <ul className="flex flex-col gap-3 max-w-2xl mx-auto">
          {chatMessages.map((msg, index) => {
            const isUser = msg.role === "user"
            return (
              <li
                key={index}
                className={`flex flex-col gap-1 max-w-[70%] ${isUser ? "self-end items-end" : "self-start items-start"}`}
              >
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? "bg-green-500 text-white rounded-br-sm"
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-bl-sm"
                }`}>
                  {msg.message}
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-600 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            )
          })}

          {/* Streaming output */}
          {output && (
            <li className="self-start items-start flex flex-col gap-1 max-w-[70%]">
              <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                {output}
                <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-zinc-400 dark:bg-zinc-500 animate-pulse rounded-sm" />
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <form
          className="flex max-w-2xl mx-auto"
          onSubmit={(e) => { e.preventDefault(); sendMessage() }}
        >
          <input
            type="text"
            placeholder="Enter your message…"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            className="
              flex-1
              bg-white dark:bg-zinc-900
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
            "
          >
            {isPending
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : "Send"
            }
          </button>
          <button
            type="button"
            onClick={()=>router.push(`/dashboard/project/${projectID}/chat/${chatID}/upload`)}
            className="
              bg-gray-600 hover:bg-gray-700
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white text-sm font-medium
              rounded-r-lg px-5 py-2.5
              flex items-center justify-center min-w-20
              transition-colors
            "
          >
           Upload
          </button>
        </form>
      </div>

    </div>
  )
}