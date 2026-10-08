"use client"

import { useState, useEffect } from "react"
import { Card } from "../components/ui/card"
import { ProgressBar } from "../components/ui/progress-bar"
import { Badge } from "../components/ui/badge"
import { ActivityCard } from "@components/activities/activity-card"
import { ChildSelector } from "@components/parent/child-selector"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"

interface Child {
  id: string
  name: string
  avatar: string
  level: string
  age: number
  progress?: number
  lastActive?: string
}

export const ParentDashboardLayout = ({
  children,
  onChildSelect,
}: {
  children: Child[]
  onChildSelect: (child: Child) => void
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="bg-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-primary">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  className="stroke-width-2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 2L2 7h20l-8 5-8-5z"
                />
              </svg>
              LearnNest India
            </span>
            <div>
              <h1 className="text-xl font-bold">LearnNest India</h1>
              <p className="text-sm text-primary/60">Foundational Learning</p>
            </div>
          </div>

          <button
            onClick={() => setShowMenu(true)}
            className="hidden md:block py-1 px-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                className="stroke-width-2"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Child Selector */}
        <ChildSelector
          children={children}
          onSelect={onChildSelect}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
        />

        {/* Welcome Section */}
        <div className="mt-6 grid lg:grid-cols-2 gap-6 items-center">
          {/* Welcome Card */}
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="stroke-width-2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 2L2 7h20l-8 5-8-5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">{t("dashboard.welcome")}</h2>
                <p className="text-muted-foreground">
                  {children[0]?.name || "Aarav"}
                  <span className="ml-1 ukg-badge">
                    {children[0]?.level || "UKG"} | Age {children[0]?.age || 5}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Last active: {children[0]?.lastActive || "Today at 2:30 PM"}
                </p>
              </div>
            </div>
          </Card>

          {/* Today's Learning Card */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t("dashboard.today_learning")}</h3>
            <ProgressBar
              value={80}
              max={100}
              className="h-4 mb-3"
            />
            <p className="text-2xl font-bold">80%</p>
            <p className="text-muted-foreground">
              {t("dashboard.learning_journey")}
            </p>
          </Card>
        </div>

        {/* Skill Overview */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">{t("dashboard.literacy")}</p>
            <div className="mt-1">
              <div className="flex justify-between text-xs">
                <span>⭐⭐⭐⭐☆</span>
                <span>75%</span>
              </div>
              <ProgressBar value={75} max={100} className="h-2" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("dashboard.numeracy")}</p>
            <div className="mt-1">
              <div className="flex justify-between text-xs">
                <span>⭐⭐⭐☆☆</span>
                <span>50%</span>
              </div>
              <ProgressBar value={50} max={100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            className="flex-1 py-2 px-4 rounded-md bg-primary text-white font-medium"
          >
            {t("dashboard.continue_learning")}
          </Button>
          <Button
            variant="outline"
            className="flex-1 py-2 px-4 rounded-md border-2 border-primary text-primary font-medium"
          >
            {t("dashboard.activities")}
          </Button>
        </div>
      </main>
    </div>
  )
}