import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// 👇 Tách riêng config ra để tái sử dụng
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_URL_API_BACKEND}/auth/login`,
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

          if (res.status !== 200) return null;

          const data = res.data;

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.token,
            expiresIn: data.expires_in,
          };
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.expiresAt = Math.floor(Date.now() / 1000) + user.expiresIn;
      }

      // @ts-ignore
      if (Date.now() >= token.expiresAt * 1000) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_URL_API_BACKEND}/auth/refresh`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
                Accept: "application/json",
              },
            }
          );

          token.accessToken = res.data.token;
          token.expiresAt =
            Math.floor(Date.now() / 1000) + res.data.expires_in;
        } catch (err) {
          console.error("Refresh token failed:", err);
          token.accessToken = null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Export API route handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };