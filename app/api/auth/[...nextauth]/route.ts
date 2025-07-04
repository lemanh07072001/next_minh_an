import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        // Gọi Laravel API để xác thực
        const res = await axios.post(
          `${process.env.URL_API_BACKEND}/auth/login`,
          {
            email: credentials?.email,
            password: credentials?.password,
          },
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (res.status !== 200) return null

        const data =  res.data

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          token: data.access_token
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Khi login thành công, user sẽ có dữ liệu
      if (user) {
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      // Truyền token Laravel về client
      session.accessToken = token.accessToken
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };
