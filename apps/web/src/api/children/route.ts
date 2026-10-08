import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST: Child login with PIN
export async function POST_child_login(request: Request) {
  try {
    const body = await request.json()
    const { childId, pin } = body

    if (!childId || !pin) {
      return NextResponse.json(
        { error: "Child ID and PIN required" },
        { status: 400 }
      )
    }

    const child = await prisma.childProfile.findUnique({
      where: { id: childId },
      include: {
        parent: true,
      },
    })

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 })
    }

    if (!child.pinEnabled) {
      return NextResponse.json({ error: "PIN not set for this child" }, { status: 403 })
    }

    // Verify PIN - in production, compare hashed PIN
    const pinValid = pin === "1234" // Mock verification

    if (!pinValid) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 })
    }

    // Update last active
    await prisma.childProfile.update({
      where: { id: childId },
      data: {
        lastActiveAt: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      child: {
        id: child.id,
        name: child.name,
        nickname: child.nickname,
        level: child.level,
        avatarId: child.avatarId,
        preferredLanguage: child.preferredLanguage,
      } 
    })
  } catch (error) {
    console.error("Child login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Child logout
export async function POST_child_logout(request: Request) {
  try {
    const body = await request.json()
    const { childId } = body

    // Just acknowledge logout - no session persistence for children
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Child logout API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get current child profile
export async function GET_child_profile(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get("childId")

    if (!childId) {
      return NextResponse.json({ child: null })
    }

    const child = await prisma.childProfile.findUnique({
      where: { id: childId },
      include: {
        activityAttempts: {
          include: {
            activity: {
              include: {
                domain: true,
                competency: true,
                learningOutcome: true,
              },
            },
          },
        },
        skillMasteries: true,
        progressRecords: true,
      },
    })

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 })
    }

    return NextResponse.json({ child })
  } catch (error) {
    console.error("Child profile API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get child home dashboard data
export async function GET_child_home(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get("childId")

    if (!childId) {
      return NextResponse.json({ home: null })
    }

    const child = await prisma.childProfile.findUnique({
      where: { id: childId },
      include: {
        activityAttempts: {
          include: {
            activity: {
              include: {
                domain: true,
                competency: true,
              },
            },
          },
        },
        skillMasteries: {
          include: {
            competency: {
              include: {
                domain: true,
              },
            },
          },
        },
        progressRecords: true,
      },
    })

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 })
    }

    // Calculate progress
    const totalActivities = child.activityAttempts.length
    const completedActivities = child.activityAttempts.filter(
      (attempt) => attempt.isCorrect || attempt.completedAt !== null
    ).length

    const accuracy = totalActivities > 0 
      ? (completedActivities / totalActivities) * 100 
      : 0

    // Calculate skill mastery
    const skillAreas = child.skillMasteries.map((mastery) => ({
      domain: mastery.competency.domain.name,
      domainHi: mastery.competency.domain.nameHi,
      competency: mastery.competency.name,
      competencyHi: mastery.competency.nameHi,
      masteryLevel: mastery.level,
      score: mastery.score,
      practiceCount: mastery.practiceCount,
      correctCount: mastery.correctCount,
      totalAttempts: mastery.totalAttempts,
    }))

    return NextResponse.json({ 
      child: {
        id: child.id,
        name: child.name,
        nickname: child.nickname,
        level: child.level,
        avatarId: child.avatarId,
        preferredLanguage: child.preferredLanguage,
      },
      progress: {
        accuracy,
        totalActivities,
        completedActivities,
        skillAreas,
      },
      recentAttempts: child.activityAttempts
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map((attempt) => ({
          activityId: attempt.activity.id,
          activityTitle: attempt.activity.title,
          activityTitleHi: attempt.activity.titleHi,
          isCorrect: attempt.isCorrect,
          timeSpentMs: attempt.timeSpentMs,
          completedAt: attempt.completedAt,
        }))
    })
  } catch (error) {
    console.error("Child home API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}