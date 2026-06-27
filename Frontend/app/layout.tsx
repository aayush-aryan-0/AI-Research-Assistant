import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Providers from "./Provider";
import ProjectProvider from "./(protected)/lib/provider/ProjectProvider";
import ChatProvider from "./(protected)/lib/provider/ChatProvider";
import ErrorProvider from "./(protected)/lib/provider/ErrorProvider";
import { useEffect } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScholarAI",
  description: "AI RESEARCH ASSITANT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
  const ping = () => fetch('/api/backend/')
  ping()
  const interval = setInterval(ping, 10 * 60 * 1000) // every 10 mins
  return () => clearInterval(interval)
}, [])
  return (
    
    <html
      lang="en" suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col  bg-background text-foreground">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Providers>
              <ProjectProvider>
                <ChatProvider>
                  <ErrorProvider>
                    {children}
                  </ErrorProvider>
                </ChatProvider>
              </ProjectProvider>
            </Providers>
          </ThemeProvider>
        </body>
    </html>

  );
}
