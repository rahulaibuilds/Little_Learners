import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Get stories for a level/language
export async function GET_stories(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level") as "PLAYGROUP" | "NURSERY" | "LKG" | "UKG" | null
    const language = searchParams.get("language") || "EN"

    const where: any = {
      language: language as any,
      status: "PUBLISHED",
    }

    if (level) {
      where.levelId = level
    }

    const stories = await prisma.story.findMany({
      where,
      include: {
        level: true,
        scenes: {
          orderBy: { order: "asc" },
          include: {
            story: true,
          },
        },
      },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error("Stories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get single story by ID
export async function GET_story(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get("id")

    if (!storyId) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 })
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: {
        scenes: {
          orderBy: { order: "asc" },
        },
        level: true,
      },
    })

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    return NextResponse.json({ story })
  } catch (error) {
    console.error("Story detail API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Start story reading
export async function POST_story_start(request: Request) {
  try {
    const body = await request.json()
    const { childId, storyId } = body

    if (!childId || !storyId) {
      return NextResponse.json(
        { error: "Child ID and Story ID required" },
        { status: 400 }
      )
    }

    // Create learning path item for the story
    const learningPathItem = await prisma.learningPathItem.create({
      data: {
        activityId: storyId,
        learningPathId: `story_${childId}`,
        order: 1,
        status: "PENDING",
      },
      include: {
        activity: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      learningPathItem 
    }
    )
  } catch (error) {
    console.error("Story start API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}