import Navbar from "../components/Navbar/Navbar"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
 
      <main>{children}</main>
    </>
  )
}