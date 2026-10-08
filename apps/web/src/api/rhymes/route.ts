import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Get rhymes for a level/language
export async function GET_rhymes(request: Request) {
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

    const rhymes = await prisma.rhyme.findMany({
      where,
      include: {
        level: true,
      },
      orderBy: [{ order: "asc" }, { title: "asc" }],
    })

    return NextResponse.json({ rhymes })
  } catch (error) {
    console.error("Rhymes API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get single rhyme by ID
export async function GET_rhyme(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rhymeId = searchParams.get("id")

    if (!rhymeId) {
      return NextResponse.json({ error: "Rhyme ID required" }, { status: 400 })
    }

    const rhyme = await prisma.rhyme.findUnique({
      where: { id: rhymeId },
      include: {
        level: true,
      },
    })

    if (!rhyme) {
      return NextResponse.json({ error: "Rhyme not found" }, { status: 404 })
    }

    return NextResponse.json({ rhyme })
  } catch (error) {
    console.error("Rhyme detail API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Start rhyme singing
export async function POST_rhyme_start(request: Request) {
  try {
    const body = await request.json()
    const { childId, rhymeId } = body

    if (!childId || !rhymeId) {
      return NextResponse.json(
        { error: "Child ID and Rhyme ID required" },
        { status: 400 }
      )
    }

    // Create learning path item for the rhyme
    const learningPathItem = await prisma.learningPathItem.create({
      data: {
        activityId: rhymeId,
        learningPathId: `rhyme_${childId}`,
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
    console.error("Rhyme start API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}