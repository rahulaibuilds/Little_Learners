"use client"

import { useState, useEffect } from "react"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Avatar } from "../../../components/ui/avatar"
import { useRouter } from "next/navigation"
import { useTranslation } from "next-i18next"
import { prisma } from "@/lib/prisma"

export default function ChildRhymesPage() {
  const [rhymes, setRhymes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    const loadRhymes = async () => {
      try {
        const fetchedRhymes = await prisma.rhyme.findMany({
          where: { status: "PUBLISHED" },
          include: { level: true },
          orderBy: [{ level: { order: "asc" } }, { title: "asc" }],
        })

        setRhymes(fetchedRhymes)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load rhymes:", error)
        setIsLoading(false)
      }
    }

    loadRhymes()
  }, [])

  const handleSingRhyme = (rhymeId: string) => {
    router.push(`/child/rhyme/${rhymeId}`)
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
      <Card className="w-full max-w-md mx-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t("child.rhymes")}</h2>

          {rhymes.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <p>{t("child.no_rhymes_available")}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rhymes.map((rhyme) => (
              <Card
                key={rhyme.id}
                className="p-4 hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={() => handleSingRhyme(rhyme.id)}
              >
                <div className="h-48 rounded-md overflow-hidden mb-3">
                  <img
                    src={rhyme.illustration || "/illustrations/default-rhyme.jpg"}
                    alt={rhyme.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{rhyme.title}</h3>
                  <p className="text-xs text-muted-foreground">{rhyme.level ? t(`levels.${rhyme.level.toLowerCase()}`) : ""}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* View all rhymes link */}
          <div className="mt-4 text-right">
            <Button
              variant="outline"
              className="py-2 px-4 rounded-md text-sm text-primary hover:text-primary/90 transition-colors">
              {t("child.view_all_rhymes")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}