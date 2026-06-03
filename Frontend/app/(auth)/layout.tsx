import NavNon from "./NavNon";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavNon/>
      
      <main>{children}</main>
    </>
  )
}