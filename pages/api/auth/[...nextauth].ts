import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// Extend Session type to include user ID
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

// Extend JWT type to include id
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
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

  // Add explicit session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - Account:", account);

      // Set token.id from profile.sub during initial authentication
      if (account && profile) {
        token.id = profile.sub;
      }
      // Handle case where token.id isn't set but token.sub is available
      else if (!token.id && token.sub) {
        token.id = token.sub;
      }

      return token;
    },

    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Session (before):", session);

      // Copy ID from token to session.user
      if (session.user && token.id) {
        session.user.id = token.id;
      }

      console.log("Session Callback - Session (after):", session);
      return session;
    },
  },

  // Add more secure cookie settings
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

export default NextAuth(authOptions);
