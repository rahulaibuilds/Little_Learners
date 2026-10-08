"use client"

import { useState, useEffect } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { AlertDialog } from "../../components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { z } from "zod"

// Step 1: Account Type
const AccountTypeSchema = z.object({
  accountType: z.enum(["parent"]),
})

type AccountTypeValues = z.infer<typeof AccountTypeSchema>["accountType"]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    preferredLanguage: "EN" as "EN" | "HI" | "HINGLISH",
  })
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Validate form
  const validateForm = (): boolean => {
    const result = AccountTypeSchema.safeParse({ accountType: step === 1 ? "parent" : undefined })
    if (!result.success) {
      return false
    }
    return true
  }

  // Send OTP
  const sendOtp = async () => {
    setIsLoading(true)
    setOtpError(null)

    // Mock OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOtpSent(true)
    setOtpCountdown(120) // 2 minutes
    setIsLoading(false)
  }

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 4) {
      setOtpError("Please enter a 4-digit OTP")
      return
    }

    setIsLoading(true)

    // Mock OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (otp === "1234") {
      // OTP verified, move to step 2
      setStep(2)
      setOtpSent(false)
      setAttempts(0)
      setOtp("")
      setOtpError(null)
    } else {
      setAttempts((prev) => prev + 1)
      if (attempts + 1 >= 3) {
        setOtpError("Too many failed attempts. Please try again later.")
        setOtpSent(false)
        setStep(1) // Reset to account type
        setAttempts(0)
      } else {
        setOtpError(`Incorrect OTP. ${3 - attempts - 1} attempts remaining.`)
      }
    }
    setIsLoading(false)
  }

  // Resend OTP
  const resendOtp = () => {
    setOtpSent(false)
    setTimeout(sendOtp, 1000)
    setOtpCountdown(120)
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      // Step 1: Account type
      if (!validateForm()) return
      setStep(2)
      sendOtp()
    } else if (step === 2) {
      // Step 2: Parent details + OTP
      if (otp.length !== 4) {
        setOtpError("Please enter the 4-digit OTP sent to your mobile number")
        return
      }
      verifyOtp()
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="w-full max-w-md mx-auto">
        {/* Account Type Step */}
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create your account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Parent / Guardian
                </label>
                <select
                  name="accountType"
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value as AccountTypeValues })}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="parent">Parent / Guardian</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                {isLoading ? "Creating..." : "Continue"}
              </button>
            </form>
          </div>
        )}

        {/* Parent Details + OTP Step */}
        {step === 2 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {otpSent ? "Mobile OTP Verification" : "Parent Details"}
            </h2>

            {otpSent && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  We've sent an OTP to your mobile number ending in {formData.mobileNumber?.slice(-4) || "****"}
                </p>
                {otpCountdown > 0 && (
                  <p className="text-sm font-medium">
                    OTP will expire in {Math.ceil(otpCountdown / 60)}:{otpCountdown % 60 < 10 ? "0" : ""}{otpCountdown % 60} minutes
                  </p>
                )}
                <button
                  onClick={resendOtp}
                  className="mt-2 text-sm underline text-primary hover:text-primary/90">
                  Resend OTP
                </button>
              </div>
            )}

            {otpSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="otp"
                  placeholder="1234"
                  value={otp}
                  onChange={handleChange}
                  className="input-lg"
                  maxLength={4}
                />
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 4}
                  className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />
                <Input
                  type="tel"
                  name="mobileNumber"
                  placeholder="+91 98765 43210"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="parent@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-lg"
                  />
                  <Input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-lg"
                  />
                </div>

                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as "EN" | "HI" | "HINGLISH" })}
                  className="input-lg rounded border px-3 py-2"
                >
                  <option value="EN">English</option>
                  <option value="HI">Hindi</option>
                  <option value="HINGLISH">Hinglish</option>
                </select>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                  {isLoading ? "Creating..." : step === 2 ? "Verify OTP" : "Continue"}
                </Button>
              </form>
            )}

            {/* OTP Error */}
            {otpError && (
              <div className="mt-3 p-3 rounded-lg bg-error/10 text-error text-sm">
                {otpError}
              </div>
            )}
          </div>
        )}

        {/* Success */}
        {step > 2 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path className="stroke-width-2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
            <p className="text-muted-foreground">
              Welcome to LearnNest India, {formData.fullName}. Let's create your child's learning profile.
            </p>
            <Button
              onClick={() => router.push("/parent/children")}
              className="my-4 py-2 px-6 rounded-md bg-secondary text-white font-medium"
            >
              Continue to Children
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}