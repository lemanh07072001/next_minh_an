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
          `${process.env.NEXT_PUBLIC_URL_API_BACKEND_LOCAL}/auth/login`,
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
          token: data.token,
          expiresIn: data.expires_in,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Khi login thành công, user sẽ có dữ liệu
      if (user) {
        token.accessToken = user.token;
        token.expiresAt = Math.floor(Date.now() / 1000) + user.expiresIn;
      }

      // Nếu token hết hạn
      // @ts-ignore
      if (Date.now() >= token.expiresAt * 1000) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API_BACKEND_LOCAL}/auth/refresh`, null, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });

          token.accessToken = res.data.token;
          token.expiresAt = Math.floor(Date.now() / 1000) + res.data.expires_in;
        } catch (err) {
          console.error("Refresh token failed:", err);
          throw err;
        }
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
