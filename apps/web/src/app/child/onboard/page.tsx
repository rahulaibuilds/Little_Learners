"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@//components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { z } from "zod"

// Level options
const levels = [
  { value: "PLAYGROUP", label: "Playgroup / Pre-Nursery" },
  { value: "NURSERY", label: "Nursery" },
  { value: "LKG", label: "LKG" },
  { value: "UKG", label: "UKG" },
]

// Language options
const languages = [
  { value: "EN", label: "English" },
  { value: "HI", label: "Hindi" },
  { value: "HINGLISH", label: "Hinglish" },
]

export default function ChildOnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    childName: "",
    childNickname: "",
    dateOfBirth: new Date(),
    level: "NURSERY" as "PLAYGROUP" | "NURSERY" | "LKG" | "UKG",
    avatar: "animal_elephant" as string,
    preferredLanguage: "EN" as "EN" | "HI" | "HINGLISH",
  })
  const [pinSet, setPinSet] = useState(false)
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const parentId = searchParams.get("parentId") || ""

  // Validate form
  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return formData.childName.trim().length >= 2
      case 2:
        return (
          formData.childName.trim().length >= 2 &&
          formData.childNickname.trim().length >= 2 &&
          formData.dateOfBirth !== null
        )
      case 3:
        return (
          formData.level !== "" &&
          formData.preferredLanguage !== ""
        )
      case 4:
        return pin === confirmPin && pin.length === 4
      default:
        return false
    }
  }

  // Next step
  const handleNext = () => {
    if (!validateStep(step)) {
      // Shake animation for invalid form
      const input = document.querySelector('input[invalid]') as HTMLInputElement
      if (input) input.classList.add("shake")
      setTimeout(() => input?.classList.remove("shake"), 300)
      return
    }

    setStep((prev) => prev + 1)
  }

  // Previous step
  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  // Set PIN
  const handleSetPin = async () => {
    if (pin !== confirmPin || pin.length !== 4) {
      setIsLoading(false)
      alert("PINs don't match. Please enter the same 4-digit PIN.")
      return
    }

    setIsLoading(true)

    // Mock PIN setting
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPinSet(true)
    setIsLoading(false)
    router.push("/child/select")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="w-full max-w-md mx-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {"Step " + step}: Let's create your child's learning profile"}
          </h2>

          {/* Step 1: Child Name */}
          {step === 1 && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your child's name to get started.
              </p>

              <form onSubmit={() => handleNext()} className="space-y-4">
                <Input
                  type="text"
                  name="childName"
                  placeholder="Aarav"
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  required
                  className="input-lg"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium">
                  {isLoading ? "Loading..." : "Next"}
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Child Details */}
          {step === 2 && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Provide your child's details for age-appropriate learning.
              </p>

              <form onSubmit={() => handleNext()} className="space-y-4">
                <Input
                  type="text"
                  name="childNickname"
                  placeholder="Aaru"
                  value={formData.childNickname}
                  onChange={(e) => setFormData({ ...formData, childNickname: e.target.value })}
                  placeholder="Nickname (optional)"
                  className="input-lg"
                />
                <Input
                  type="text"
                  name="childName"
                  placeholder="Aarav"
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  required
                  className="input-lg"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth instanceof Date ? formData.dateOfBirth : new Date(formData.dateOfBirth)}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.valueAsDate })}
                    required
                    className="input-lg"
                  />
                  <Select
                    options={levels}
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                    className="input-lg"
                  >
                    <Select.Item value="">Select Level</Select.Item>
                  </Select>
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
                  className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium">
                  {isLoading ? "Loading..." : "Next"}
                </Button>
              </form>
            </div>
          )}

          {/* Step 3: Avatar & PIN */}
          {step === 3 && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Choose an avatar and set a PIN for child access.
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <Avatar
                  name="Aarav"
                  className={formData.avatar === "animal_elephant" ? "border-2 border-primary" : ""}
                  onClick={() => setFormData({ ...formData, avatar: "animal_elephant" })}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2L2 7h20l-8 5-8-5zM2 17h20v2H2v-2zm0 4h20v2H2v-2z"
                    />
                  </svg>
                </Avatar>
                <Avatar
                  name="Kiara"
                  className={formData.avatar === "animal_tiger" ? "border-2 border-primary" : ""}
                  onClick={() => setFormData({ ...formData, avatar: "animal_tiger" })}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2L2 7h20l-8 5-8-5zM2 17h20v2H2v-2zm0 4h20v2H2v-2z"
                    />
                  </svg>
                </Avatar>
                <Avatar
                  name="Vihaan"
                  className={formData.avatar === "animal_monkey" ? "border-2 border-primary" : ""}
                  onClick={() => setFormData({ ...formData, avatar: "animal_monkey" })}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2L2 7h20l-8 5-8-5zM2 17h20v2H2v-2zm0 4h20v2H2v-2z"
                    />
                  </svg>
                </Avatar>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <Input
                  type="text"
                  name="pin"
                  placeholder="1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN"
                  required
                  className="input-lg"
                  inputMode="numeric"
                />
                <Input
                  type="text"
                  name="confirmPin"
                  placeholder="1234"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm PIN"
                  required
                  className="input-lg"
                  inputMode="numeric"
                />
              </div>

              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                {isLoading ? "Setting..." : "Next"}
              </Button>
            </div>
          )}

          {/* Step 4: PIN Set */}
          {step === 4 && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="stroke-width-2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">PIN Set!</h2>
              <p className="text-muted-foreground">
                Your child can now access LearnNest with their name and PIN.
              </p>
              <Button
                onClick={() => router.push("/child/select")}
                className="my-4 py-2 px-6 rounded-md bg-secondary text-white font-medium"
              >
                Continue to Child Mode
              </Button>
            </div>
          )}

          {/* Error */}
          {step > 4 && (
            <div className="p-6 text-center text-error">
              <p>Something went wrong. Please try again.</p>
              <Button
                onClick={() => setStep(1)}
                className="my-4 py-2 px-4 rounded-md bg-error/20 text-error hover:text-error/90"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}