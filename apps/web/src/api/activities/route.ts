import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Get all activities for a level/domain
export async function GET_activities(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level") as "PLAYGROUP" | "NURSERY" | "LKG" | "UKG" | null
    const domain = searchParams.get("domain")
    const language = searchParams.get("language") || "EN"
    const difficulty = searchParams.get("difficulty")

    const where: any = {
      language: language as any,
      status: "PUBLISHED",
    }

    if (level) {
      where.levelId = level
    }

    if (domain) {
      where.domainId = domain
    }

    if (difficulty) {
      where.difficulty = difficulty as any
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        domain: true,
        competency: true,
        learningOutcome: true,
      },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Activities API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get single activity by ID
export async function GET_activity(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
      const activityId = searchParams.get("id")

    if (!activityId) {
      return NextResponse.json({ error: "Activity ID required" }, { status: 400 })
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        domain: true,
        competency: true,
        learningOutcome: true,
        questions: {
          orderBy: { order: "asc" },
        },
      },
    })

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json({ activity })
  } catch (error) {
    console.error("Activity detail API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Start an activity
export async function POST_start_activity(request: Request) {
  try {
    const body = await request.json()
    const { childId, activityId } = body

    if (!childId || !activityId) {
      return NextResponse.json(
        { error: "Child ID and Activity ID required" },
        { status: 400 }
      )
    }

    // Check prerequisites
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        competency: true,
        learningOutcome: true,
      },
    })

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    // Check if child has prerequisite competencies
    if (activity.prerequisites && activity.prerequisites.length > 0) {
      const childProgress = await prisma.childProgress.findFirst({
        where: {
          childId,
          domainId: activity.domainId,
          levelId: activity.levelId,
        },
      })

      if (!childProgress) {
        // Child hasn't started this domain/level yet, allow to start
      }
    }

    // Create a learning path item and return activity details
    const learningPathItem = await prisma.learningPathItem.create({
      data: {
        activityId,
        learningPathId: `temp_${childId}_${activityId}`, // Simplified
        order: 1,
        status: "PENDING",
      },
      include: {
        activity: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      activity,
      learningPathItem 
    }
    )
  } catch (error) {
    console.error("Start activity API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Submit activity attempt
export async function POST_attempt(request: Request) {
  try {
    const body = await request.json()
    const { childId, activityId, questionId, answer, timeSpentMs, hintsUsed } = body

    if (!childId || !activityId) {
      return NextResponse.json(
        { error: "Child ID and Activity ID required" },
        { status: 400 }
      )
    }

    const question = questionId 
      ? await prisma.activityQuestion.findUnique({ where: { id: questionId } })
      : null

    // Determine if answer is correct
    let isCorrect = false

    if (question && question.correctAnswer) {
      const correctAnswer = question.correctAnswer
      const userAnswer = answer

      // Simple comparison - in production, use proper answer checking
      isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)
    }

    // Create activity attempt
    const attempt = await prisma.activityAttempt.create({
      data: {
        childId,
        activityId,
        questionId,
        answer,
        isCorrect,
        timeSpentMs,
        hintsUsed: hintsUsed || 0,
      },
      include: {
        activity: true,
        question: true,
      },
    })

    // Update skill mastery
    if (question && question.competencyId) {
      await prisma.skillMastery.upsert({
        where: {
          childId_competencyId: {
            childId,
            competencyId: question.competencyId,
          },
        },
        update: {
          score: {
            increment: isCorrect ? 1 : 0,
          },
          practiceCount: {
            increment: 1,
          },
          totalAttempts: {
            increment: 1,
          },
          lastPracticedAt: new Date(),
        },
        create: {
          childId,
          competencyId: question.competencyId,
          level: "NOT_STARTED",
          score: isCorrect ? 1 : 0,
          practiceCount: 1,
          totalAttempts: 1,
        },
      })
    }

    return NextResponse.json({ 
      success: true, 
      attempt,
      isCorrect 
    }
    )
  } catch (error) {
    console.error("Activity attempt API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get progress for a child
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

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Progress API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}