import BackButton from "../components/Backbutton";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <BackButton />
      </div>
      <main>{children}</main>
    </div>
  )
}