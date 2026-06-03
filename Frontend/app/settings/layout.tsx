import BackButton from "../components/Backbutton";
export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <BackButton/>
      <main>{children}</main>
      <BackButton/>
    </>
  )
}