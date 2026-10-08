"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Avatar } from "../components/ui/avatar"
import { ProgressBar } from "../components/ui/progress-bar"
import { Badge } from "../components/ui/badge"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"
import { usePathname } from "next/navigation"

type ActivityJourney = {
  id: number
  title: string
  icon: string
  color: string
  route: string
  description: string
}

type ChildProfile = {
  name: string
  avatar: string
  level: string
  age: number
}

export const ChildHomePage = () => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  // Get child info from pathname or context
  const [childName, setChildName] = useState("Aarav")
  const [childAvatar, setChildAvatar] = useState("🐼")
  const [childLevel, setChildLevel] = useState("UKG")
  const [childAge, setChildAge] = useState(5)

  // Check if we have child info in URL params
  useEffect(() => {
    // Parse child name from URL or use default
    const urlChildName = pathname.match(/child\/select\?childName=([^&]+)/)
    if (urlChildName?.[1]) {
      setChildName(urlChildName[1])
    }
  }, [pathname])

  const [learningProgress, setLearningProgress] = useState(80)
  const [dailyJourneyCount, setDailyJourneyCount] = useState(5)

  const journeys: ActivityJourney[] = [
    { id: 1, title: t("abc_adventure"), icon: "text-indicator", color: "#4A90E2", route: "/child/learn", description: t("learn_alphabet") },
    { id: 2, title: t("number_jungle"), icon: "calculator", color: "#7ED321", route: "/child/learn", description: t("learn_numbers") },
    { id: 3, title: t("creative_corner"), icon: "palette", color: "#FF6B6B", route: "/child/create", description: t("creative_activity") },
    { id: 4, title: t("story_time"), icon: "book", color: "#4A2C9A", route: "/child/stories", description: t("read_stories") },
    { id: 5, title: t("rhymes"), icon: "music", color: "#ED4C67", route: "/child/rhymes", description: t("sing_rhymes") },
    { id: 6, title: t("explore_world"), icon: "leaf", color: "#FFB400", route: "/child/play", description: t("explore_environment") },
  ]

  const handleContinueLearning = () => {
    // Navigate to the first available learning activity
    router.push("/child/learn")
  }

  const handleViewProfile = () => {
    // Navigate to child select/profile view
    router.push("/child/select")
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
              {t("age_level", { level: childLevel, age: childAge })}
            </p>
          </div>

          {/* Today's Learning Progress */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">{t("today_learning")}</p>
            <ProgressBar
              value={learningProgress}
              max={100}
              className="h-4"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {learningProgress}% {t("complete")}
            </p>
          </div>

          {/* Daily Journey */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">{t("daily_journey")}</p>
            <div className="grid grid-cols-2 gap-2">
              {journeys.map((journey) => (
                <div
                  key={journey.id}
                  className={`rounded-md p-3 transition-colors cursor-pointer hover:bg-primary/10 ${pathname.starts(journey.route) ? "bg-primary/20 ring-2 ring-primary/50" : ""}`},
                  onClick={() => router.push(journey.route)}
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
            onClick={handleContinueLearning}
            className="w-full py-3 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors mt-4">
            {t("continue_learning")}
          </Button>
        </div>
      </Card>
    </div>
  )
}