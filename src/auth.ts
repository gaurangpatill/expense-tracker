import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";

import { prisma } from "@/db/prisma";

const providers: NextAuthOptions["providers"] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, request) {
      const email = credentials?.email?.toLowerCase().trim();
      if (!email || !credentials?.password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        console.log("[auth] userFound", Boolean(user));
        console.log(
          "[auth] password fields",
          user ? Object.keys(user).filter((key) => key.toLowerCase().includes("pass")) : []
        );
        return null;
      }

      const ok = await bcrypt.compare(credentials.password, user.passwordHash);
      console.log("[auth] userFound", true);
      console.log(
        "[auth] password fields",
        Object.keys(user).filter((key) => key.toLowerCase().includes("pass"))
      );
      console.log("[auth] passwordMatch", ok);
      if (!ok) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

export function auth() {
  return getServerSession(authOptions);
}
