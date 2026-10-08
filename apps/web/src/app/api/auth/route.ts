import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { otpService } from "@/services/otp.service"
import { parentAuthService } from "@/services/auth.service"
import { z } from "zod"

// Schema definitions
const accountTypeSchema = z.object({ accountType: z.enum(["parent"]) })
const parentDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  mobileNumber: z.string().min(10, "Valid mobile number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password required"),
  city: z.string().optional(),
  state: z.string().optional(),
  preferredLanguage: z.enum(["EN", "HI", "HINGLISH"]),
})
const otpVerifySchema = z.object({ otp: z.string().length(4, "OTP must be 4 digits") })

type AccountTypeValues = z.infer<typeof accountTypeSchema>["accountType"]
type ParentDetailsValues = z.infer<typeof parentDetailsSchema>

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    switch (action) {
      case "check-session":
        // Check if user has an active session
        return NextResponse.json({ 
          hasSession: false, 
          role: null 
        })
      case "get-profile":
        // Get current user profile
        return NextResponse.json({ profile: null })
      default:
        return NextResponse.json({ 
          isAuthenticated: false, 
          user: null 
        })
    }
  } catch (error) {
    console.error("Auth GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, ...rest } = body

    switch (action) {
      case "signup-step1":
        // Step 1: Account type selection
        {/
        const result = accountTypeSchema.safeParse(rest)
        if (!result.success) {
          return NextResponse.json(
            { error: "Invalid account type" },
            { status: 400 }
          )
        }
        parentAuthService.setStep("parent_details")
        return NextResponse.json({ success: true })
        /}
      case "signup-step2":
        // Step 2: Parent details + OTP verification
        {/
        const result = parentDetailsSchema.safeParse(rest)
        if (!result.success) {
          return NextResponse.json(
            { error: "Invalid parent details", details: result.error.format() },
            { status: 400 }
          )
        }

        parentAuthService.setFormData(result.data)
        
        // Verify OTP
        if (parentAuthService.getOtpCode().length !== 4) {
          return NextResponse.json(
            { error: "Please enter the 4-digit OTP" },
            { status: 400 }
          )
        }

        const verifyResult = await otpService.verifyOTP(
          parentAuthService.getFormData()!.mobileNumber,
          parentAuthService.getOtpCode()
        )

        if (verifyResult.success) {
          return NextResponse.json({ 
            success: true, 
            message: "OTP verified successfully" 
          })
        } else {
          const attempts = (parentAuthService.getAttempts() || 0) + 1
          parentAuthService.setAttempts(attempts)

          if (attempts >= 3) {
            parentAuthService.setOtpError("Too many failed attempts. Please try again later.")
            parentAuthService.setStep("account_type")
            parentAuthService.setAttempts(0)
            return NextResponse.json(
              { error: "Too many failed attempts" },
              { status: 400 }
            )
          }

          return NextResponse.json(
            { error: `Incorrect OTP. ${3 - attempts} attempts remaining.` },
            { status: 400 }
          )
        }
        /}
      case "send-otp":
        // Send OTP
        {/
        const { mobileNumber } = rest
        if (!mobileNumber) {
          return NextResponse.json(
            { error: "Mobile number required" },
            { status: 400 }
          )
        }
        parentAuthService.setFormData({ ...parentAuthService.getFormData(), mobileNumber })
        await parentAuthService.sendOTP()
        return NextResponse.json({ success: true })
        /}
      case "verify-otp":
        // Verify OTP
        {/
        const result = otpVerifySchema.safeParse(rest)
        if (!result.success) {
          return NextResponse.json(
            { error: "Invalid OTP format" },
            { status: 400 }
          )
        }
        parentAuthService.setOtpCode(result.data.otp)
        await parentAuthService.verifyOTP()
        return NextResponse.json({ success: true })
        /}
      case "resend-otp":
        // Resend OTP
        {/
        const { mobileNumber, requestId } = rest
        if (!mobileNumber) {
          return NextResponse.json(
            { error: "Mobile number required" },
            { status: 400 }
          )
        }
        parentAuthService.setFormData({ ...parentAuthService.getFormData(), mobileNumber })
        const resendResult = await otpService.resendOTP(mobileNumber, requestId || "")
        return NextResponse.json(resendResult)
        /}
      case "signup-complete":
        // Signup complete - create parent profile
        {/
        // This would be called after OTP verification
        // The actual profile creation happens in the service
        return NextResponse.json({ success: true })
        /}
      case "login":
        // Login
        {/
        const { email, password } = rest
        if (!email || !password) {
          return NextResponse.json(
            { error: "Email and password required" },
            { status: 400 }
          )
        }
        const loginResult = await loginService.handleLogin({ email, password })
        if (loginResult.success) {
          return NextResponse.json({ success: true })
        } else {
          return NextResponse.json(
            { error: loginResult.error },
            { status: 401 }
          )
        }
        /}
      case "logout":
        // Logout
        return NextResponse.json({ success: true })
      case "forgot-password":
        // Forgot password
        {/
        const { email } = rest
        if (!email) {
          return NextResponse.json(
            { error: "Email required" },
            { status: 400 }
          )
        }
        const forgotResult = await loginService.handleForgotPassword(email)
        return NextResponse.json(forgotResult)
        /}
      case "reset-password":
        // Reset password
        {/
        const { token, newPassword } = rest
        if (!token || !newPassword) {
          return NextResponse.json(
            { error: "Token and new password required" },
            { status: 400 }
          )
        }
        const resetResult = await loginService.handleResetPassword(token, newPassword)
        return NextResponse.json(resetResult)
        /}
      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Auth POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}