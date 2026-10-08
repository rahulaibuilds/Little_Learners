import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Admin Panel API Routes
 * Provides REST endpoints for admin CMS and management
 */

// GET: Admin dashboard overview
export async function GET_admin_dashboard(request: Request) {
  try {
    // Get counts for dashboard overview
    const [
      totalUsers,
      totalParents,
      totalChildren,
      totalActivities,
      totalStories,
      totalRhymes,
      pendingActivities,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.parent.count(),
      prisma.childProfile.count(),
      prisma.activity.count({ where: { status: "PUBLISHED" } }),
      prisma.story.count({ where: { status: "PUBLISHED" } }),
      prisma.rhyme.count({ where: { status: "PUBLISHED" } }),
      prisma.activity.count({ where: { status: "DRAFT" } }),
    ])

    // Get recent signups
    const recentParents = await prisma.parent.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: { email: true, createdAt: true },
        },
      },
    })

    // Get recent activities
    const recentActivities = await prisma.activity.findMany({
      where: { status: "DRAFT" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { domain: true, level: true },
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalParents,
        totalChildren,
        totalActivities,
        totalStories,
        totalRhymes,
        pendingActivities,
      },
      recentParents,
      recentActivities,
    })
  } catch (error) {
    console.error("Admin dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Parents API
// ============================================

// GET: List all parents
export async function GET_parents(request: Request) {
  try {
    const parents = await prisma.parent.findMany({
      include: {
        user: {
          select: { email: true, fullName: true, createdAt: true },
        },
        children: {
          take: 2,
          orderBy: { name: "asc" },
        },
      },
      orderBy: { "user.createdAt": "desc" },
    })

    return NextResponse.json({ parents })
  } catch (error) {
    console.error("Admin parents API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get single parent
export async function GET_parent(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    if (!parentId) {
      return NextResponse.json({ error: "Parent ID required" }, { status: 400 })
    }

    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        user: true,
        children: {
          orderBy: { name: "asc" },
        },
      },
    })

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 })
    }

    return NextResponse.json({ parent })
  } catch (error) {
    console.error("Admin parent detail API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Children API
// ============================================

// GET: List all children
export async function GET_children_admin(request: Request) {
  try {
    const children = await prisma.childProfile.findMany({
      include: {
        parent: {
          include: { user: { select: { fullName: true, email: true } } },
        },
        level: true,
        avatar: true,
      },
      orderBy: [{ level: "asc" }, { name: "asc" }],
    })

    return NextResponse.json({ children })
  } catch (error) {
    console.error("Admin children API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Curriculum API
// ============================================

// GET: List all levels
export async function GET_levels(request: Request) {
  try {
    const levels = await prisma.level.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }],
    })

    return NextResponse.json({ levels })
  } catch (error) {
    console.error("Admin levels API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: List all domains
export async function GET_domains(request: Request) {
  try {
    const domains = await prisma.domain.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }],
    })

    return NextResponse.json({ domains })
  } catch (error) {
    console.error("Admin domains API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: List all competencies
export async function GET_competencies(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
      const levelId = searchParams.get("levelId")

    const where: any = { isActive: true }

    if (levelId) {
      where.levelId = levelId
    }

    const competencies = await prisma.competency.findMany({
      where,
      include: { level: true, domain: true },
      orderBy: [{ level: "asc" }, { order: "asc" }],
    })

    return NextResponse.json({ competencies })
  } catch (error) {
    console.error("Admin competencies API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: List all learning outcomes
export async function GET_learning_outcomes(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const competencyId = searchParams.get("competencyId")

    const where: any = { isActive: true }

    if (competencyId) {
      where.competencyId = competencyId
    }

    const outcomes = await prisma.learningOutcome.findMany({
      where,
      include: { competency: true, level: true, domain: true },
      orderBy: [{ competency: { order: "asc" } }, { order: "asc" }],
    })

    return NextResponse.json({ outcomes })
  } catch (error) {
    console.error("Admin learning outcomes API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Activities API
// ============================================

// GET: List all activities with filters
export async function GET_activities_admin(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const levelId = searchParams.get("levelId")
    const domainId = searchParams.get("domainId")
    const activityType = searchParams.get("activityType")
    const difficulty = searchParams.get("difficulty")
    const status = searchParams.get("status")
    const language = searchParams.get("language")

    const where: any = {}

    if (levelId) where.levelId = levelId
    if (domainId) where.domainId = domainId
    if (activityType) where.activityType = activityType as any
    if (difficulty) where.difficulty = difficulty as any
    if (status) where.status = status
    if (language) where.language = language as any

    const activities = await prisma.activity.findMany({
      where,
      include: {
        level: true,
        domain: true,
        competency: true,
        learningOutcome: true,
      },
      orderBy: [{ level: { order: "asc" } }, { domain: { order: "asc" } }, { order: "asc" }],
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Admin activities API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create new activity
export async function POST_activity(request: Request) {
  try {
    const body = await request.json()
    const {
      code, title, titleHi, titleHinglish,
      description, descriptionHi, descriptionHinglish,
      levelId, domainId, competencyId, learningOutcomeId,
      activityType, difficulty, language,
      estimatedDurationSec, instructions, instructionsHi, instructionsHinglish,
      media, configuration, hints, reward,
      prerequisites, status,
    } = body

    // Validate required fields
    if (!code || !title || !levelId || !activityType) {
      return NextResponse.json(
        { error: "Missing required fields: code, title, levelId, activityType" },
        { status: 400 }
      )
    }

    const activity = await prisma.activity.create({
      data: {
        code,
        title,
        titleHi,
        titleHinglish,
        description,
        descriptionHi,
        descriptionHinglish,
        level: { connect: { id: levelId } },
        domain: domainId ? { connect: { id: domainId } } : undefined,
        competency: competencyId ? { connect: { id: competencyId } } : undefined,
        learningOutcome: learningOutcomeId ? { connect: { id: learningOutcomeId } } : undefined,
        activityType,
        difficulty: difficulty || "EASY",
        language: language || "EN",
        estimatedDurationSec,
        instructions,
        instructionsHi,
        instructionsHinglish,
        media: media || {},
        configuration: configuration || {},
        hints: hints || [],
        reward: reward || { type: "STAR", points: 10 },
        prerequisites: prerequisites || [],
        status: status || "DRAFT",
      },
      include: {
        level: true,
        domain: true,
        competency: true,
        learningOutcome: true,
      },
    })

    return NextResponse.json({ success: true, activity }, { status: 201 })
  } catch (error) {
    console.error("Create activity API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH: Update activity
export async function PATCH_activity(request: Request) {
  try {
    const body = await request.json()
    const { activityId, updates } = body

    if (!activityId) {
      return NextResponse.json(
        { error: "Activity ID required" },
        { status: 400 }
      )
    }

    const activity = await prisma.activity.update({
      where: { id: activityId },
      data: updates,
      include: {
        level: true,
        domain: true,
        competency: true,
        learningOutcome: true,
      },
    })

    return NextResponse.json({ success: true, activity })
  } catch (error) {
    console.error("Update activity API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE: Delete/archive activity
export async function DELETE_activity(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activityId = searchParams.get("activityId")

    if (!activityId) {
      return NextResponse.json(
        { error: "Activity ID required" },
        { status: 400 }
      )
    }

    await prisma.activity.delete({
      where: { id: activityId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete activity API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Stories API
// ============================================

// GET: List all stories
export async function GET_stories_admin(request: Request) {
  try {
    const stories = await prisma.story.findMany({
      where: { isPublished: true }, // Note: schema uses status, not isPublished
      include: { level: true },
      orderBy: [{ level: { order: "asc" } }, { title: "asc" }],
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error("Admin stories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create story
export async function POST_story(request: Request) {
  try {
    const body = await request.json()
    const {
      code, title, titleHi, titleHinglish,
      description, descriptionHi, descriptionHinglish,
      levelId, language, characters,
      coverImage, audioUrl, durationSec,
      learningObjective, learningObjectiveHi, learningObjectiveHinglish,
      status,
    } = body

    if (!code || !title || !levelId) {
      return NextResponse.json(
        { error: "Missing required fields: code, title, levelId" },
        { status: 400 }
      )
    }

    const story = await prisma.story.create({
      data: {
        code,
        title,
        titleHi,
        titleHinglish,
        description,
        descriptionHi,
        descriptionHinglish,
        level: { connect: { id: levelId } },
        language: language || "EN",
        characters: characters || [],
        coverImage,
        audioUrl,
        durationSec,
        learningObjective,
        learningObjectiveHi,
        learningObjectiveHinglish,
        status: status || "DRAFT",
      },
      include: { level: true },
    })

    return NextResponse.json({ success: true, story }, { status: 201 })
  } catch (error) {
    console.error("Create story API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Rhymes API
// ============================================

// GET: List all rhymes
export async function GET_rhymes_admin(request: Request) {
  try {
    const rhymes = await prisma.rhyme.findMany({
      where: { status: "PUBLISHED" },
      include: { level: true },
      orderBy: [{ level: { order: "asc" } }, { title: "asc" }],
    })

    return NextResponse.json({ rhymes })
  } catch (error) {
    console.error("Admin rhymes API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create rhyme
export async function POST_rhyme(request: Request) {
  try {
    const body = await request.json()
    const {
      code, title, titleHi, titleHinglish,
      levelId, language, lyrics, lyricsHi, lyricsHinglish,
      audioUrl, illustration, theme,
      status,
    } = body

    if (!code || !title || !levelId) {
      return NextResponse.json(
        { error: "Missing required fields: code, title, levelId" },
        { status: 400 }
      )
    }

    const rhyme = await prisma.rhyme.create({
      data: {
        code,
        title,
        titleHi,
        titleHinglish,
        level: { connect: { id: levelId } },
        language: language || "EN",
        lyrics,
        lyricsHi,
        lyricsHinglish,
        audioUrl,
        illustration,
        theme,
        status: status || "DRAFT",
      },
      include: { level: true },
    })

    return NextResponse.json({ success: true, rhyme }, { status: 201 })
  } catch (error) {
    console.error("Create rhyme API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Rewards API
// ============================================

// GET: List all rewards/badges
export async function GET_rewards(request: Request) {
  try {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }],
    })

    return NextResponse.json({ rewards })
  } catch (error) {
    console.error("Admin rewards API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create reward
export async function POST_reward(request: Request) {
  try {
    const body = await request.json()
    const {
      code, name, nameHi, nameHinglish,
      description, descriptionHi, descriptionHinglish,
      type, icon, color, points,
      isActive,
    } = body

    if (!code || !name || !type) {
      return NextResponse.json(
        { error: "Missing required fields: code, name, type" },
        { status: 400 }
      )
    }

    const reward = await prisma.reward.create({
      data: {
        code,
        name,
        nameHi,
        nameHinglish,
        description,
        descriptionHi,
        descriptionHinglish,
        type: type as any,
        icon,
        color,
        points: points || 10,
        isActive: isActive !== false,
      },
    })

    return NextResponse.json({ success: true, reward }, { status: 201 })
  } catch (error) {
    console.error("Create reward API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Languages API
// ============================================

// GET: List all languages
export async function GET_languages(request: Request) {
  try {
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }],
    })

    return NextResponse.json({ languages })
  } catch (error) {
    console.error("Admin languages API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Add translation
export async function POST_translation(request: Request) {
  try {
    const body = await request.json()
    const { languageId, namespace, key, value, context } = body

    if (!languageId || !namespace || !key || value === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: languageId, namespace, key, value" },
        { status: 400 }
      )
    }

    const translation = await prisma.translation.create({
      data: {
        languageId,
        namespace,
        key,
        value,
        context,
      },
    })

    return NextResponse.json({ success: true, translation }, { status: 201 })
  } catch (error) {
    console.error("Add translation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Analytics API
// ============================================

// GET: Get analytics summary
export async function GET_analytics(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")
    const childId = searchParams.get("childId")
    const period = searchParams.get("period") || "30d"

    let where: any = {}

    if (childId) where.childId = childId
    else if (parentId) {
      // Get children under this parent
      const children = await prisma.childProfile.findMany({ where: { parentId } })
      where.childId = { in: children.map((c) => c.id) }
    }

    // Calculate period dates
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    where.createdAt = { gte: startDate }

    // Get activity attempts
    const activityAttempts = await prisma.activityAttempt.findMany({
      where,
      include: { activity: { include: { domain: true, competency: true } } },
    })

    // Get weekly reports
    const weeklyReports = await prisma.weeklyReport.findMany({
      where: { childId: { in: where.childId instanceof Array ? where.childId : [where.childId] } },
      orderBy: { weekStartDate: "desc" },
      take: 4,
    })

    // Calculate stats
    const totalAttempts = activityAttempts.length
    const correctAttempts = activityAttempts.filter((a) => a.isCorrect).length
    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0

    const totalTimeMs = activityAttempts.reduce(
      (sum, attempt) => sum + (attempt.timeSpentMs || 0),
      0
    )

    // Activities by domain
    const domainStats: any = {}

    activityAttempts.forEach((attempt) => {
      const domain = attempt.activity.domain?.name || "Unknown"
      if (!domainStats[domain]) {
        domainStats[domain] = { total: 0, correct: 0 }
      }
      domainStats[domain].total++
      if (attempt.isCorrect) domainStats[domain].correct++
    }

    const domainBreakdown = Object.entries(domainStats).map(([domain, stats]) => ({
      domain,
      total: stats.total,
      correct: stats.correct,
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
    }))

    return NextResponse.json({
      stats: {
        totalAttempts,
        correctAttempts,
        accuracy: Math.round(accuracy),
        totalTimeMs,
        period,
      },
      domainBreakdown,
      weeklyReports,
    })
  } catch (error) {
    console.error("Admin analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ============================================
// Audit Logs API
// ============================================

// GET: Get audit logs
export async function GET_audit_logs(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
      const limit = searchParams.get("limit") || "50"
    const entityType = searchParams.get("entityType")

    const where: any = {}

    if (entityType) where.entityType = entityType

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
      include: { user: { select: { email: true, name: true } } },
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Admin audit logs API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}