"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Avatar } from "../components/ui/avatar"
import { ProgressBar } from "../components/ui/progress-bar"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"

export const ChildHomeLayout = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [childName, setChildName] = useState("Aarav")
  const [childAvatar, setChildAvatar] = useState("🐼")
  const [learningProgress, setLearningProgress] = useState(80)
  const [dailyJourneyCount, setDailyJourneyCount] = useState(5)

  // Sample learning journeys with multilingual support
  const journeys = [
    { id: 1, title: t("child_home.abc_adventure"), icon: "text-indicator", color: "#4A90E2" },
    { id: 2, title: t("child_home.number_jungle"), icon: "calculator", color: "#7ED321" },
    { id: 3, title: t("child_home.creative_corner"), icon: "palette", color: "#FF6B6B" },
    { id: 4, title: t("child_home.story_time"), icon: "book", color: "#4A2C9A" },
    { id: 5, title: t("child_home.rhymes"), icon: "music", color: "#ED4C67" },
    { id: 6, title: t("child_home.explore_my_world"), icon: "leaf", color: "#FFB400" },
  ]

  const handleContinue = () => {
    // Navigate to learning section - first journey
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
              className="text-4xl mb-3"
            >
              {childAvatar}
            </Avatar>
            <h2 className="text-2xl font-bold mb-1">{childName}</h2>
            <p className="text-muted-foreground ukg-age">
              UKG | Age 5
            </p>
          </div>

          {/* Today's Learning Progress */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">{t("child_home.today_learning")}</p>
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
            <p className="text-sm text-muted-foreground mb-3">{t("child_home.daily_journey")}</p>
            <div className="grid grid-cols-2 gap-2">
              {journeys.map((journey) => (
                <div
                  key={journey.id}
                  className={`rounded-md p-3 transition-colors cursor-pointer hover:bg-primary/10`}
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
            className="w-full py-3 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors mt-4">
            {t("child_home.continue_learning")}
          </Button>
        </div>
      </Card>
    </div>
  )
}