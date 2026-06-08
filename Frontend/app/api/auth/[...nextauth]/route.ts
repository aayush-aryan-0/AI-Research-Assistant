
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.id_token = account.id_token  // pass to FastAPI
            }
            return token
        },
        async session({ session, token }) {
            session.id_token = token.id_token
            return session
        }
    }
})

export { handler as GET, handler as POST }