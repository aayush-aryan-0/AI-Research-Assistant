"use client";

import { useState, useEffect } from "react";
import Chat from "../type/Chat.type";
import ChatContext from "../context/ChatContext";

const LOCAL_STORAGE_KEY = "current_chat";

const defaultChat: Chat = {
  id: "",
  project_id: "",
  title: "",
  timestamp: ""
};

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  // Safe initialization prevents Next.js server-side hydration errors
  const [chat, setChat] = useState<Chat>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultChat;
    }
    return defaultChat;
  });

  // Automatically sync state variations back to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chat));
    }
  }, [chat]);

  return (
    <ChatContext.Provider value={{ chat, setChat }}>
      {children}
    </ChatContext.Provider>
  );
}
