import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Get current parent profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    if (parentId) {
      const parent = await prisma.parent.findUnique({
        where: { id: parentId },
        include: {
          children: {
            include: {
              activityAttempts: {
                include: {
                  activity: true,
                },
              },
              skillMasteries: true,
              progressRecords: true,
            },
          },
        },
      })

      if (!parent) {
        return NextResponse.json({ error: "Parent not found" }, { status: 404 })
      }

      return NextResponse.json({ parent })
    }

    // Return current session parent (would come from auth)
    return NextResponse.json({ parent: null })
  } catch (error) {
    console.error("Parent API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: Get parent's children list
export async function GET_children(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    if (!parentId) {
      return NextResponse.json({ children: [] })
    }

    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        children: {
          orderBy: [{ level: "asc" }, { name: "asc" }],
          include: {
            _count: {
              select: { activityAttempts: true },
            },
          },
        },
      })

      if (!parent) {
        return NextResponse.json({ error: "Parent not found" }, { status: 404 })
      }

      return NextResponse.json({ children: parent.children })
    }
  } catch (error) {
    console.error("Parent children API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create a new child profile
export async function POST_children(request: Request) {
  try {
    const body = await request.json()
    const { parentId, childData } = body

    if (!parentId || !childData) {
      return NextResponse.json(
        { error: "Parent ID and child data required" },
        { status: 400 }
      )
    }

    // Validate required child data
    if (!childData.name || childData.name.trim().length < 2) {
      return NextResponse.json(
        { error: "Child name must be at least 2 characters" },
        { status: 400 }
      )
    }

    // Determine level based on age, or use provided level
    let level = childData.level || "NURSERY"

    // Create child profile
    const child = await prisma.childProfile.create({
      data: {
        parentId,
        name: childData.name.trim(),
        nickname: childData.nickname?.trim(),
        dateOfBirth: childData.dateOfBirth 
          ? new Date(childData.dateOfBirth)
          : new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000), // Default: ~4 years ago
        level: level as "PLAYGROUP" | "NURSERY" | "LKG" | "UKG",
        avatarId: childData.avatarId || "animal_elephant",
        preferredLanguage: childData.preferredLanguage || "EN",
        pinEnabled: childData.pinEnabled !== false,
        settings: {
          reduceMotion: childData.reduceMotion ?? false,
          autoAdvanceActivities: childData.autoAdvanceActivities ?? true,
          language: childData.preferredLanguage || "en",
        },
      },
      include: {
        activityAttempts: true,
        skillMasteries: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      child 
    }
    )
  } catch (error) {
    console.error("Create child API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH: Update child profile
export async function PATCH_children(request: Request) {
  try {
    const body = await request.json()
    const { childId, updates } = body

    if (!childId || !updates) {
      return NextResponse.json(
        { error: "Child ID and updates required" },
        { status: 400 }
      )
    }

    const child = await prisma.childProfile.update({
      where: { id: childId },
      data: updates,
      include: {
        activityAttempts: { include: { activity: true } },
        skillMasteries: true,
      },
    })

    return NextResponse.json({ success: true, child })
  } catch (error) {
    console.error("Update child API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE: Delete/soft-delete child profile
export async function DELETE_children(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const childId = searchParams.get("childId")

    if (!childId) {
      return NextResponse.json(
        { error: "Child ID required" },
        { status: 400 }
      )
    }

    await prisma.childProfile.delete({
      where: { id: childId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete child API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}