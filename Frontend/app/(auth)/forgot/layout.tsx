import { EmailVerificationProvider } from "../(email_verification)/EmailVerificationProvider";
export default function ForgotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 
    <EmailVerificationProvider>
      <main>{children}</main>
    </EmailVerificationProvider>

  )
}