import  ProjectProvider  from "../lib/provider/ProjectProvider";
import ChatProvider from "../lib/provider/ChatProvider";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 
    <ProjectProvider>
    <ChatProvider>
         <main>{children}</main>
    </ChatProvider>
    </ProjectProvider>

  )
}