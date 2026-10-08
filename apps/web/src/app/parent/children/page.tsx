"use client"

import { useState, useEffect } from "react"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Avatar } from "../../../components/ui/avatar"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"
import { prisma } from "@/lib/prisma"

interface Child {
  id: string
  name: string
  nickname: string | null
  level: string
  age: number
  avatar: string
  lastActive: string | null
  progress: number
}

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    // In a real app, we'd get the parentId from auth context
    // For now, load mock data or fetch from API
    const loadChildren = async () => {
      try {
        // Fetch children for the current parent
        const parentChildren = await prisma.childProfile.findMany({
          where: { isActive: true },
          include: {
            activityAttempts: {
              include: {
                activity: {
                  include: { domain: true },
                },
              },
            },
          },
          orderBy: [{ level: "asc" }, { name: "asc" }],
        })

        const childrenData = parentChildren.map((child) => ({
          id: child.id,
          name: child.name,
          nickname: child.nickname,
          level: child.level,
          age: new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear(),
          avatar: child.avatarId || "animal_elephant",
          lastActive: child.lastActiveAt 
            ? "Today at " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
            : null,
          progress: child.activityAttempts.length > 0 
            ? Math.min(100, Math.round((child.activityAttempts.filter((a) => a.isCorrect).length / child.activityAttempts.length) * 100))
            : 0,
        }))

        setChildren(childrenData)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load children:", error)
        setIsLoading(false)
      }
    }

    loadChildren()
  }, [])

  const handleAddChild = () => {
    router.push("/parent/children/add")
  }

  const handleSelectChild = (child: Child) => {
    router.push(`/child/select?childId=${child.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" />
            <p>{t("general.loading")}</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t("parent.children")}</h2>

          {/* Add Child Button */}
          <div className="mb-6">
            <Button
              onClick={handleAddChild}
              className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
              {t("parent.add_child")}
            </Button>
          </div>

          {/* Children List */}
          {children.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <p>{t("parent.no_children_yet")}</p>
              <p className="mt-2">{t("parent.start_by_adding_a_child")}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <Card
                key={child.id}
                className="p-5 hover:bg-primary/5 transition-colards cursor-pointer"
                onClick={() => handleSelectChild(child)}
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    name={child.name}
                    className="w-10 h-10 flex-shrink-0"
                  >
                    {child.avatar}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{child.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {child.level} | Age {child.age}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <ProgressBar
                    value={child.progress}
                    max={100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {child.progress}% complete
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* No children message */}
          {children.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("parent.create_child_profile_first")}
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}