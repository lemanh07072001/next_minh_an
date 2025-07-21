import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import jwt from "jsonwebtoken"
import {JWTDecodeParams} from "next-auth/jwt";
// 👇 Tách riêng config ra để tái sử dụng
// @ts-ignore
export const authOptions : NextAuthOptions = {
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
    async jwt({ token, user }: { token: any; user: any}) {
      /* 1. Lần đăng nhập đầu */
      if (user) {
        token.accessToken = user.accessToken;
        // ⬇️ Lưu expiresAt dưới dạng **milliseconds**
        token.expiresAt = Date.now() + user.expiresIn * 1000;
        return token; // trả ngay, tránh chạy tiếp
      }

      /* 2. Token còn hạn → trả sớm */
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      /* 3. Hết hạn → refresh */
      console.log("REFRESH WITH TOKEN:", token.accessToken?.slice(0, 20));
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

        console.log("REFRESH SUCCESS:", res);

        token.accessToken = res.data.token;
        token.expiresAt = Date.now() + res.data.expires_in * 1000;

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/admin/login",
  },


};

// ✅ Export API route handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
