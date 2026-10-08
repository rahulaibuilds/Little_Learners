import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Email-based sign in
    EmailProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "parent@email.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          throw new Error("No account found with this email")
        }

        // In production, verify password with Argon2id or bcrypt
        const isValid = credentials.password === "parent123" // Mock verification

        if (!isValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.fullName,
        }
      },
    }),
  ],
  pages: {
    signIn: "/parent/login",
    signUp: "/parent/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/parent/onboard",
  },
  callbacks: {
    async signIn({ user, account, email, credentials }) {
      // Log sign-in events for analytics
      if (process.env.NODE_ENV === "production") {
        // TODO: Log analytics event
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

// Export for dynamic usage
export const GET = async (req: Request) => {
  return new Response(JSON.stringify(authOptions), {
    headers: { "Content-Type": "application/json" },
  })
}

export const POST = async (req: Request) => {
  const body = await req.json()
  // Handle auth signals, etc.
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  })
}