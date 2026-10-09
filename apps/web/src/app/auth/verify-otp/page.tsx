"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"
import { otpService } from "@/services/otp.service"
import { parentAuthService } from "@/services/auth.service"

export default function VerifyOTPPage() {
  const [step, setStep] = useState(1) // 1 = send otp, 2 = verify otp
  const [formData, setFormData] = useState({
    mobileNumber: "",
    otp: "",
    fullName: "",
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
  const { t } = useTranslation()

  useEffect(() => {
    // If we're on step 2, pre-fill mobile number from URL or localStorage
    if (step === 2) {
      const savedMobile = localStorage.getItem("pending_mobile")
      if (savedMobile) {
        setFormData({ ...formData, mobileNumber: savedMobile })
      }
    }
  }, [step])

  const validateForm = (): boolean => {
    if (step === 1) {
      return formData.accountType === "parent"
    }
    if (step === 2) {
      return formData.mobileNumber.trim().length >= 10 && otp.length === 4
    }
    return true
  }

  const sendOtp = async () => {
    if (!formData.mobileNumber) {
      setOtpError("Please enter your mobile number")
      return
    }

    setIsLoading(true)
    setOtpError(null)

    try {
      const result = await otpService.sendOTP(formData.mobileNumber)

      if (result.success) {
        setOtpSent(true)
        setOtpCountdown(300) // 5 minutes
        // Save mobile for verification step
        localStorage.setItem("pending_mobile", formData.mobileNumber)
        setIsLoading(false)
      } else {
        setOtpError(result.error || "Failed to send OTP")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      setOtpError("Failed to send OTP. Please try again.")
      setIsLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      setOtpError("Please enter a 4-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      const result = await otpService.verifyOTP(formData.mobileNumber, otp)

      if (result.success && result.user) {
        // OTP verified - create parent account
        parentAuthService.setFormData({
          ...parentAuthService.getFormData(),
          fullName: formData.fullName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          preferredLanguage: formData.preferredLanguage,
        })

        parentAuthService.setStep(2) // Move to parent details step which will complete signup
        parentAuthService.setOtpSent(false)
        parentAuthService.setAttempts(0)
        parentAuthService.setOtp("")
        parentAuthService.setOtpError(null)
        parentAuthService.setIsLoading(false)

        router.push("/parent/children")
      } else {
        setAttempts((prev) => prev + 1)

        if (attempts + 1 >= 3) {
          setOtpError("Too many failed attempts. Please try again later.")
          setOtpSent(false)
          setStep(1)
          setAttempts(0)
          setOtpCountdown(0)
        } else {
          setOtpError(`Incorrect OTP. ${3 - attempts - 1} attempts remaining.`)
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Verify OTP error:", error)
      setOtpError("Failed to verify OTP. Please try again.")
      setIsLoading(false)
    }
  }

  const resendOtp = () => {
    setOtpSent(false)
    setTimeout(sendOtp, 1000)
    setOtpCountdown(300)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      // Step 1: Account type
      if (!validateForm()) return
      setStep(2)
      sendOtp()
    } else if (step === 2) {
      // Step 2: Verify OTP
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
            <h2 className="text-2xl font-bold mb-4">{t("parent.signup")}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("parent.account_type")}
                </label>
                <select
                  name="accountType"
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value as "parent" })}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="parent">{t("parent.parent_guardian")}</option>
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
              {otpSent ? t("parent.otp_verification") : t("parent.parent_details")}
            </h2>

            {otpSent && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {t("parent.otp_sent", { last4: formData.mobileNumber?.slice(-4) || "****" })}
                </p>
                {otpCountdown > 0 && (
                  <p className="text-sm font-medium">
                    {t("parent.otp_expiry", {
                      minutes: Math.ceil(otpCountdown / 60),
                      seconds: otpCountdown % 60,
                    })}
                  </p>
                )}
                <button
                  onClick={resendOtp}
                  className="mt-2 text-sm underline text-primary hover:text-primary/90">
                  {t("parent.resend_otp")}
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
                  placeholder={t("parent.full_name")}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />
                <Input
                  type="tel"
                  name="mobileNumber"
                  placeholder={t("parent.mobile_number", { prefix: "+91 " })}
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder={t("parent.email")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder={t("parent.password")}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder={t("parent.confirm_password")}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-lg"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    name="city"
                    placeholder={t("parent.city")}
                    value={formData.city}
                    onChange={handleChange}
                    className="input-lg"
                  />
                  <Input
                    type="text"
                    name="state"
                    placeholder={t("parent.state")}
                    value={formData.state}
                    onChange={handleChange}
                    className="input-lg"
                  />
                </div>

                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredLanguage: e.target.value as "EN" | "HI" | "HINGLISH" })
                  }
                  className="input-lg rounded border px-3 py-2"
                >
                  <option value="EN">{t("parent.english")}</option>
                  <option value="HI">{t("parent.hindi")}</option>
                  <option value="HINGLISH">{t("parent.hinglish")}</option>
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
              {t("parent.welcome", { name: formData.fullName })}
            </p>
            <Button
              onClick={() => router.push("/parent/children")}
              className="my-4 py-2 px-6 rounded-md bg-secondary text-white font-medium">
              {t("parent.continue_children")}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}