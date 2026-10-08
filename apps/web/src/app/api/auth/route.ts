import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"
import { getServerSession } from "next-auth"

// GET: Check authentication status
export async function GET() {
  const session = await getServerSession(authOptions)
  return NextResponse.json({ 
    isAuthenticated: !!session,
    user: session?.user || null 
  })
}

// POST: Handle auth signals (sign in, sign out, etc.)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, ...rest } = body

    switch (type) {
      case "signin":
        // Handle sign in
        return NextResponse.json({ success: true })
      case "signout":
        // Handle sign out
        return NextResponse.json({ success: true })
      case "verify-otp":
        // Handle OTP verification
        return NextResponse.json({ success: true })
      default:
        return NextResponse.json(
          { error: "Unknown auth type" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Auth API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}