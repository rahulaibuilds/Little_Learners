"use client"

import { useState, useEffect, useCallback } from "react"
import { prisma } from "@/lib/prisma"
import { otpService } from "@/services/otp.service"
import { useRouter } from "next/navigation"
import { z } from "zod"

/**
 * Authentication Service - handles signup, login, OTP, password, etc.
 */

export interface ParentSignupData {
  fullName: string
  email: string
  mobileNumber: string
  password: string
  confirmPassword: string
  city?: string
  state?: string
  preferredLanguage: "EN" | "HI" | "HINGLISH"
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * OTP verification result
 */
export interface OtpVerificationResult {
  success: boolean
  user?: {
    id: string
    email: string
    role: string
    name: string
  }
  error?: string
}

/**
 * Auth service states
 */
enum AuthStep {
  ACCOUNT_TYPE = "account_type",
  PARENT_DETAILS = "parent_details",
  OTP_VERIFICATION = "otp_verification",
  COMPLETED = "completed",
}

/**
 * Parent Auth Page Service
 * Manages the multi-step onboarding flow for parent signup
 */
export class ParentAuthService {
  private step: AuthStep = AuthStep.ACCOUNT_TYPE
  private formData: Partial<ParentSignupData> = {}
  private otpCode: string = ""
  private otpSent: boolean = false
  private otpError: string | null = null
  private otpCountdown: number = 0
  private attempts: number = 0
  private isLoading: boolean = false
  router: ReturnType<typeof useRouter> | null = null

  setRouter(router: ReturnType<typeof useRouter>) {
    this.router = router
  }

  getStep(): AuthStep {
    return this.step
  }

  setStep(step: AuthStep) {
    this.step = step
  }

  getFormData(): Partial<ParentSignupData> {
    return this.formData
  }

  setFormData(data: Partial<ParentSignupData>) {
    this.formData = { ...this.formData, ...data }
  }

  getOtpCode(): string {
    return this.otpCode
  }

  setOtpCode(code: string) {
    this.otpCode = code
  }

  isOtpSent(): boolean {
    return this.otpSent
  }

  setOtpSent(sent: boolean) {
    this.otpSent = sent
  }

  getOtpError(): string | null {
    return this.otpError
  }

  setOtpError(error: string | null) {
    this.otpError = error
  }

  getCountdown(): number {
    return this.otpCountdown
  }

  setCountdown(count: number) {
    this.otpCountdown = count
  }

  getAttempts(): number {
    return this.attempts
  }

  setAttempts(attempts: number) {
    this.attempts = attempts
  }

  getIsLoading(): boolean {
    return this.isLoading
  }

  setIsLoading(loading: boolean) {
    this.isLoading = loading
  }

  /**
   * Start the signup process at step 1
   */
  startSignup() {
    this.step = AuthStep.ACCOUNT_TYPE
    this.formData = {}
    this.otpCode = ""
    this.otpSent = false
    this.otpError = null
    this.attempts = 0
    this.isLoading = false
  }

  /**
   * Handle account type selection
   */
  async handleAccountType(accountType: "parent") {
    if (accountType !== "parent") return

    this.step = AuthStep.PARENT_DETAILS
    this.isLoading = false
  }

  /**
   * Send OTP to the parent's mobile number
   */
  async sendOTP() {
    if (!this.formData.mobileNumber) {
      this.setOtpError("Please enter your mobile number")
      return
    }
    if (!this.formData.email) {
      this.setOtpError("Please enter your email")
      return
    }

    this.setIsLoading(true)
    this.setOtpError(null)

    try {
      const result = await otpService.sendOTP(this.formData.mobileNumber)

      if (result.success) {
        this.setOtpSent(true)
        this.setCountdown(300) // 5 minutes in seconds
        this.startCountdown()
        this.setIsLoading(false)
      } else {
        this.setOtpError(result.error || "Failed to send OTP")
        this.setIsLoading(false)
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      this.setOtpError("Failed to send OTP. Please try again.")
      this.setIsLoading(false)
    }
  }

  /**
   * Start the countdown timer for OTP expiry
   */
  private startCountdown() {
    const interval = setInterval(() => {
      this.setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          this.setOtpSent(false)
          this.setOtpError("OTP has expired. Please request a new one.")
          this.setCountdown(0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  /**
   * Verify the entered OTP
   */
  async verifyOTP() {
    if (!this.formData.mobileNumber) {
      this.setOtpError("Mobile number not provided. Please start over.")
      return
    }

    if (this.otpCode.length !== 4) {
      this.setOtpError("Please enter the full 4-digit OTP")
      return
    }

    this.setIsLoading(true)
    this.setOtpError(null)

    try {
      const result = await otpService.verifyOTP(this.formData.mobileNumber, this.otpCode)

      if (result.success && result.user) {
        // OTP verified - create user and parent profile
        await this.createParentAccount(result.user)
      } else {
        this.setAttempts((prev) => prev + 1)

        if (this.getAttempts() >= 3) {
          this.setOtpError("Too many failed attempts. Please try again later.")
          this.setOtpSent(false)
          this.setStep(AuthStep.ACCOUNT_TYPE)
          this.setAttempts(0)
          this.setCountdown(0)
        } else {
          this.setOtpError(`Incorrect OTP. ${3 - this.getAttempts()} attempts remaining.`)
        }
        this.setIsLoading(false)
      }
    } catch (error) {
      console.error("Verify OTP error:", error)
      this.setOtpError("Failed to verify OTP. Please try again.")
      this.setIsLoading(false)
    }
  }

  /**
   * Create the parent account in the database
   */
  private async createParentAccount(user: any) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: this.formData.email },
      })

      let prismaUser: any

      if (existingUser) {
        prismaUser = existingUser
      } else {
        // Hash password - in production use Argon2id
        const passwordHash = await this.hashPassword(this.formData.password)

        prismaUser = await prisma.user.create({
          data: {
            email: this.formData.email,
            passwordHash,
            role: "PARENT",
            isActive: true,
          },
        })
      }

      // Create parent profile
      const parent = await prisma.parent.create({
        data: {
          userId: prismaUser.id,
          fullName: this.formData.fullName,
          email: this.formData.email,
          mobileNumber: this.formData.mobileNumber,
          preferredLanguage: this.formData.preferredLanguage,
          city: this.formData.city,
          state: this.formData.state,
          onboardingCompleted: false,
          onboardingStep: 1,
        },
      })

      // Navigate to child onboarding
      this.setIsLoading(false)
      this.router?.push("/parent/children")
    } catch (error) {
      console.error("Create parent account error:", error)
      this.setOtpError("Failed to create account. Please try again.")
      this.setIsLoading(false)
    }
  }

  /**
   * Hash password using Argon2id (or bcrypt in production)
   */
  private async hashPassword(password: string): Promise<string> {
    // TODO: Use Argon2id in production
    // For now, use a simple simulation
    const crypto = require("crypto")
    const hash = crypto.createHash("sha256").update(password).digest("base64")
    return `$2b$12$${hash.slice(0, 52)}`
  }

  /**
   * Handle form change
   */
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    this.setFormData({ ...this.formData, [name]: value })
  }

  /**
   * Handle form submission at current step
   */
  async handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    this.setIsLoading(true)
    this.setOtpError(null)

    try {
      if (this.step === AuthStep.ACCOUNT_TYPE) {
        // Step 1: Account type
        if (this.formData.accountType !== "parent") {
          this.setOtpError("Please select Parent / Guardian")
          this.setIsLoading(false)
          return
        }
        this.step = AuthStep.PARENT_DETAILS
      } else if (this.step === AuthStep.PARENT_DETAILS) {
        // Step 2: Parent details + OTP
        if (this.otpCode.length !== 4) {
          this.setOtpError("Please enter the 4-digit OTP sent to your mobile number")
          this.setIsLoading(false)
          return
        }
        await this.verifyOTP()
      }
    } catch (error) {
      console.error("Handle submit error:", error)
      this.setOtpError("An error occurred. Please try again.")
    } finally {
      this.setIsLoading(false)
    }
  }
}

/**
 * Login Service
 */
export class LoginService {
  router: ReturnType<typeof useRouter> | null = null

  setRouter(router: ReturnType<typeof useRouter>) {
    this.router = router
  }

  async handleLogin(credentials: LoginCredentials) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      })

      if (!user || !user.passwordHash) {
        return { success: false, error: "No account found with this email" }
      }

      // In production, verify password with Argon2id/bcrypt
      const isValid = credentials.password === "parent123" // Mock check

      if (!isValid) {
        return { success: false, error: "Invalid password" }
      }

      // Navigate to dashboard
      this.router?.push("/parent/dashboard")

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  async handleForgotPassword(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        // Don't reveal if email exists or not
        return { success: true, message: "If an account with this email exists, a password reset link has been sent." }
      }

      // TODO: Send reset token via email
      console.log(`Password reset requested for ${email}`)
      return { success: true, message: "Password reset link sent (mock)" }
    } catch (error) {
      console.error("Forgot password error:", error)
      return { success: false, error: "Failed to process request." }
    }
  }

  async handleResetPassword(token: string, newPassword: string) {
    try {
      // TODO: Verify reset token and update password
      console.log(`Resetting password with token: ${token}`)
      return { success: true }
    } catch (error) {
      console.error("Reset password error:", error)
      return { success: false }
    }
  }
}

export const parentAuthService = new ParentAuthService()
export const loginService = new LoginService()