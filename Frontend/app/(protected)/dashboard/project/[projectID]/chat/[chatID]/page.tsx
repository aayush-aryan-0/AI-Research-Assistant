"use client"



import { useState, useEffect } from "react"
import { useTransition } from "react"
import { useParams } from "next/navigation"
import { ParamValue } from "next/dist/server/request/params"
import api from "@/app/lib/api/api"
type Chat = {
  message: string,
  role: string,
  chat_id:ParamValue,
  timestamp: Date
}

export default function ChatPage() {
  const [isPending, setTransition] = useTransition()
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [chatHistory, setChatHistory] = useState<Array<Chat>>([])
  const {projectID,chatID}=useParams();
  
  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await api.get(`project/${projectID}/chat/${chatID}/message/get_all`)
        setChatHistory(result.data)
      } catch (e) {
        console.error("Failed to load history", e)
      }
    }
    loadHistory()
  }, [chatID,projectID])

  async function handleStream(newHistory: Array<Chat>) {
    setTransition(async () => {
      const response = await fetch(`http://localhost:8000/project/${projectID}/chat/${chatID}/message/prompt`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHistory)
      })

      if (!response.ok) throw new Error("Request failed")

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

      setChatHistory((prev) => [
        ...prev,
        { message: aiChat,
           role: "assistant", 
           chat_id:chatID,
           timestamp: new Date() },
      ])
      setOutput("")
    })
  }

  async function sendMessage() {
    try {
      if (!input.trim()) return
      const newHistory: Array<Chat> = [
        ...chatHistory,
        { message: input, 
          role: "user", 
          chat_id:chatID,
          timestamp: new Date() },
      ]
      setChatHistory(newHistory)
      setInput("")
      await handleStream(newHistory)
    } catch (error: unknown) {
      setError(String(error))
    }
  }





    return (
        <>
        
        <div 
            className="flex flex-col items-center justify-center gap-4"
        >
            <div
                className="font-bold m-10 text-5xl mt-1" 
            >
                Chat
            </div>
            {
                error&&
                <div 
                className="text-red-500 text-2xl"
                >
                    {error}
                </div>
                
            }

            <div
                className="flex flex-col items-center 
                justify-center gap-1
                bg-gray-700
                rounded-2xl
                h-lvh
                w-lvw

                " 
            >
                <div 
                    className="flex flex-col items-center  h-[70vh] w-max overflow-y-auto
                    "
                >
                    <ul className="flex flex-col gap-2">

                        
                       {chatHistory.map((value: Chat, index: number)=>{
                            
                            
                            return (<li className=
                                        {`
                                        flex flex-row items-center 
                                        justify-center gap-1
                                        min-w-10
                                        max-w-3xs
                                        w-fit
                                       
                                        ${value.role==="user"?
                                            `mr-0 ml-96`:
                                            `ml-0 mr-96`}
                                        `}
                            key={index}
                            >
                               
                               <div
                                    className={`
                                         text-2xl
                                          rounded-2xl p-1 
                                        ${value.role==="user"?
                                             `bg-green-400`:
                                            ` bg-blue-300`}`}
                               
                               >
                                {value.message}
                               </div> 
                                <div
                                className="text-sm "
                               >
                                {value.timestamp.toDateString()}
                               </div>
                               
                            </li>)
                          })}

                          {
                            output&&
                            <li 
                            className="flex flex-row items-center 
                                        justify-center gap-1
                                        min-w-10
                                        max-w-3xs
                                        w-fit text-white 
                                        text-2xl rounded-2xl 
                                        ml-0 mr-96 
                                        bg-blue-300 p-1"
                            >
                                <p>{output}</p>
                            </li>
                
                        }

                    </ul>
                  

                </div>
                <form
                className="flex flex-col"
                onSubmit={(e)=>{
                    e.preventDefault();
                    sendMessage();
                }}
                >

                    <div >
                        <input 
                            type="text" 
                            placeholder="Enter Your Message"
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setInput(e.target.value)}
                        
                            className="bg-gray-500 rounded-l-2xl p-1 px-2
                        
                            "
                        />
                        <button
                            type="submit"

                            disabled={isPending}
                            className="bg-lime-600 text-white rounded-r-2xl p-1 px-2.5"
                        >
                           {isPending?"loading...":"➤"}
                        </button>
                    </div>

                </form>
            </div>

        </div>
        
        </>
    )
}