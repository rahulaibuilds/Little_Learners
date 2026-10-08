"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { ProgressBar } from "@/components/ui/progress-bar"
import { useRouter } from "next/navigation"

export default function ChildHomePage() {
  const [childName, setChildName] = useState("Aarav")
  const [childAvatar, setChildAvatar] = useState("🐼")
  const [learningProgress, setLearningProgress] = useState(80)
  const [dailyJourney, setDailyJourney] = useState(5)
  const router = useRouter()

  // Sample learning journeys
  const journeys = [
    { id: 1, title: "ABC Adventure", icon: "text-indicator", color: "#4A90E2" },
    { id: 2, title: "Number Jungle", icon: "calculator", color: "#7ED321" },
    { id: 3, title: "Creative Corner", icon: "palette", color: "#FF6B6B" },
    { id: 4, title: "Story Time", icon: "book", color: "#4A2C9A" },
    { id: 5, title: "Rhymes", icon: "music", color: "#ED4C67" },
    { id: 6, title: "Explore My World", icon: "leaf", color: "#FFB400" },
  ]

  const handleContinue = () => {
    // Navigate to learning section
    router.push("/child/learn")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="w-full max-w-md mx-auto">
        <div className="p-6">
          {/* Child Greeting */}
          <div className="text-center mb-6">
            <Avatar
              name={childName}
              className="text-4xl"
            >
              {childAvatar}
            </Avatar>
            <h2 className="text-2xl font-bold mt-2">{childName}</h2>
            <p className="text-muted-foreground ukg-age">
              UKG | Age 5
            </p>
          </div>

          {/* Today's Learning Progress */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Today's Learning</p>
            <ProgressBar
              value={learningProgress}
              max={100}
              className="h-4"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {learningProgress}% complete
            </p>
          </div>

          {/* Daily Journey */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">🔥 5 Day Learning Journey</p>
            <div className="grid grid-cols-2 gap-2">
              {journeys.map((journey) => (
                <div
                  key={journey.id}
                  className={`rounded-md p-3 transition-colors ${
                    Math.random() > 0.5 ? "bg-primary/10" : "bg-surface"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${journey.color === "#4A90E2" ? "text-primary" : journey.color === "#7ED321" ? "text-success" : journey.color === "#FF6B6B" ? "text-error" : journey.color === "#4A2C9A" ? "text-info" : journey.color === "#ED4C67" ? "text-warning" : "text-primary"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className={`stroke-width-2 ${journey.color === "#4A90E2" ? "stroke-primary" : journey.color === "#7ED321" ? "stroke-success" : journey.color === "#FF6B6B" ? "stroke-error" : journey.color === "#4A2C9A" ? "stroke-info" : journey.color === "#ED4C67" ? "stroke-warning" : "stroke-primary"}`}
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="ml-2 text-sm font-medium">
                    {journey.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Learning Button */}
          <Button
            onClick={handleContinue}
            className="w-full py-3 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
            Continue Learning →
          </Button>
        </div>
      </Card>
    </div>
  )
}

type UkgAgeProps = "playgroup" | "nursery" | "lkg" | "ukg"