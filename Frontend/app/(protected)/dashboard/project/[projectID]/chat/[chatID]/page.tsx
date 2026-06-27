"use client"

import { useState, useEffect, useTransition } from "react"
import { useParams } from "next/navigation"
import { ParamValue } from "next/dist/server/request/params"
import api from "@/app/lib/api/api"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import useChat from "@/app/(protected)/lib/hooks/useChat"
import Error from "@/app/components/Error"

type ChatMessage = {
  message: string,
  chat_id: ParamValue,
  role: string,
  timestamp: string
}

export default function ChatPage() {
  const [isPending, setTransition] = useTransition()
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [chatMessages, setChatMessages] = useState<Array<ChatMessage>>([])
  const { projectID, chatID } = useParams()
  const { chat } = useChat()

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await api.get(`project/${projectID}/chat/${chatID}/message/get_all`)
        if (result.data.length > 0) setChatMessages(result.data)
      } catch (e) {
        console.error("Failed to load history", e)
      }
    }
    loadHistory()
  }, [chatID, projectID])

  async function handleStream(newMessages: ChatMessage) {
    setTransition(async () => {
      const response = await fetch(
        `/api/backend/project/${projectID}/chat/${chatID}/message/prompt`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessages)
        }
      )

      if (!response.ok) {
        setError("Request failed")
        return
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

      setChatMessages((prev) => [...prev, { message: aiChat, role: "assistant", chat_id: chatID, timestamp: new Date().toISOString() }])
      setOutput("")
    })
  }

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = { message: input, role: "user", chat_id: chatID, timestamp: new Date().toISOString() }
    setChatMessages((prev) => [...prev, userMsg])
    setInput("")
    await handleStream(userMsg)
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-10 font-semibold text-gray-900 dark:text-gray-100">
        Chat: {chat.title}
      </div>

      <Error error={error} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {chatMessages.map((msg, index) => {
            const isUser = msg.role === "user"
            return (
              <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  isUser 
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-br-none" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-bl-none"
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.message}</ReactMarkdown>
                </div>
              </div>
            )
          })}

          {output && (
            <div className="justify-start flex">
              <div className="max-w-[85%] px-5 py-3 rounded-2xl rounded-bl-none text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{output}</ReactMarkdown>
                <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white dark:bg-gray-950 p-4 border-t border-gray-200 dark:border-gray-800">
        <form className="flex max-w-2xl mx-auto gap-2" onSubmit={(e) => { e.preventDefault(); sendMessage() }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 transition-all"
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg px-6 py-2 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  )
}