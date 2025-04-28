import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// Perluas tipe Session untuk menyertakan id
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - Account:", account);
      if (account && profile) {
        token.id = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Session (before):", session);

      // Eksplisit menyalin id dari token ke session.user
      session.user.id = token.id as string;

      console.log("Session Callback - Session (after):", session);
      return session;
    },
  },
};

export default NextAuth(authOptions);
