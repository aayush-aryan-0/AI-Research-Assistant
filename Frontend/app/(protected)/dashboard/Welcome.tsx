"use client";
import { useState, useEffect } from "react";

function useStream(path: string) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStream() {
      try {
        const res = await fetch(`/api/backend/${path}`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok || !res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;
          setData((prev) => prev + decoder.decode(value, { stream: true }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStream();
    return () => { cancelled = true; };
  }, [path]);

  return { data, loading };
}

export default function Welcome() {
  const welcome = useStream("/greetings/welcome");
  const message = useStream("/greetings/welcome_message");

  return (
    <div className="space-y-3 px-1 py-2">
      {welcome.loading ? (
        <div className="h-10 w-64 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ) : (
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {welcome.data}
        </h1>
      )}

      {message.loading ? (
        <div className="h-5 w-80 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse" />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {message.data}
        </p>
      )}
    </div>
  );
}