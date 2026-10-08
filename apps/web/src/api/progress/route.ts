import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Get progress for a specific child
export async function GET_progress(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get("childId")

    if (!childId) {
      return NextResponse.json({ progress: [] })
    }

    const progress = await prisma.childProgress.findMany({
      where: { childId },
      include: {
        domain: true,
        level: true,
      },
      orderBy: [{ level: "asc" }, { domain: "asc" }],
    })

    // Also get skill masteries
    const skillMasteries = await prisma.skillMastery.findMany({
      where: { childId },
      include: {
        competency: {
          include: {
            domain: true,
          },
        },
      },
    })

    return NextResponse.json({ 
      progress,
      skillMasteries 
    }
    )
  } catch (error) {
    console.error("Progress detail API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get skill progression for a child
export async function GET_skills(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get("childId")

    if (!childId) {
      return NextResponse.json({ skills: [] })
    }

    const skills = await prisma.skillMastery.findMany({
      where: { childId },
      include: {
        competency: {
          include: {
            domain: true,
            level: true,
          },
        },
      },
      orderBy: [{ competency: { level: "asc" } }, { competency: { order: "asc" }] },
    })

    // Transform for dashboard display
    const skillAreas = skills.map((mastery) => ({
      id: mastery.id,
      domainId: mastery.competency.domainId,
      domainName: mastery.competency.domain.name,
      domainNameHi: mastery.competency.domain.nameHi,
      competencyId: mastery.competency.id,
      competencyName: mastery.competency.name,
      competencyNameHi: mastery.competency.nameHi,
      masteryLevel: mastery.level,
      score: mastery.score,
      practiceCount: mastery.practiceCount,
      correctCount: mastery.correctCount,
      totalAttempts: mastery.totalAttempts,
      lastPracticedAt: mastery.lastPracticedAt,
    }))

    return NextResponse.json({ skills: skillAreas })
  } catch (error) {
    console.error("Skills API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get weekly report for a child
export async function GET_weekly_report(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get("childId")
    const parentId = searchParams.get("parentId")
    const weekStart = searchParams.get("weekStart")

    if (!childId) {
      return NextResponse.json({ report: null })
    }

    // Build where clause
    const where: any = { childId }
    if (parentId) where.parentId = parentId
    if (weekStart) where.weekStartDate = new Date(weekStart)

    const report = await prisma.weeklyReport.findFirst({
      where,
      orderBy: { weekStartDate: "desc" },
      include: {
        strengths: true,
        practiceAreas: true,
        recommendations: true,
      },
    })

    // If no report exists, create a summary from activity attempts
    if (!report) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const activityAttempts = await prisma.activityAttempt.findMany({
        where: { childId, createdAt: { gte: thirtyDaysAgo } },
        include: { activity: { include: { domain: true, competency: true } } },
      })

      const totalActivities = activityAttempts.length
      const completedActivities = activityAttempts.filter(
        (a) => a.isCorrect || a.timeSpentMs > 0
      ).length

      const strengths: any[] = []
      const practiceAreas: any[] = []

      // Analyze by domain
      const domainStats: any = {}
      
      activityAttempts.forEach((attempt) => {
        const domain = attempt.activity.domain?.name || "Unknown"
        if (!domainStats[domain]) {
          domainStats[domain] = { total: 0, correct: 0 }
        }
        domainStats[domain].total++
        if (attempt.isCorrect) domainStats[domain].correct++
      })

      // Generate strengths and practice areas
      Object.entries(domainStats).forEach(([domain, stats]) => {
        const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
        if (accuracy >= 80) {
          strengths.push({ domain, accuracy: Math.round(accuracy) })
        } else if (accuracy < 60) {
          practiceAreas.push({ domain, accuracy: Math.round(accuracy) })
        }
      })

      return NextResponse.json({ 
        report: null,
        summary: {
          totalActivities,
          completedActivities,
          accuracy: totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0,
          strengths,
          practiceAreas,
        }
      }
    )

    return NextResponse.json({ report })
  } catch (error) {
    console.error("Weekly report API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}