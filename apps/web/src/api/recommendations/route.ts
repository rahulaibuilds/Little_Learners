import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Parent Recommendations Engine
 * Generates recommendations based on child's progress and performance
 */
export async function GET_recommendations(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")
    const childId = searchParams.get("childId")

    if (!childId) {
      return NextResponse.json({ recommendations: [] })
    }

    // Get child's progress and skill masteries
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

    // Get recent activity attempts
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const activityAttempts = await prisma.activityAttempt.findMany({
      where: { childId, createdAt: { gte: thirtyDaysAgo } },
      include: { activity: { include: { domain: true, competency: true } } },
    })

    const recommendations: any[] = []

    // Analyze strengths and practice areas based on mastery levels
    const strengths: any[] = []
    const practiceAreas: any[] = []

    skillMasteries.forEach((mastery) => {
      if (mastery.level === "CONFIDENT") {
        strengths.push({
          id: mastery.id,
          domain: mastery.competency.domain.name,
          domainHi: mastery.competency.domain.nameHi,
          competency: mastery.competency.name,
          competencyHi: mastery.competency.nameHi,
          level: mastery.level,
        })
      } else if (mastery.level === "DEVELOPING" || mastery.level === "PRACTICING") {
        practiceAreas.push({
          id: mastery.id,
          domain: mastery.competency.domain.name,
          domainHi: mastery.competency.domain.nameHi,
          competency: mastery.competency.name,
          competencyHi: mastery.competency.nameHi,
          level: mastery.level,
          score: mastery.score,
          totalAttempts: mastery.totalAttempts,
        })
      }
    })

    recommendations.push({
      type: "STRENGTH",
      title: "Strengths",
      titleHi: "बल्किले",
      titleHinglish: "Balakile",
      description: "Your child has shown confidence in the following areas:",
      descriptionHi: "आपके बच्चे ने निम्नलिखित क्षेत्रों में आत्मविश्वास दिखाया है:",
      descriptionHinglish: "Aapke bache ne nimnलिखित kshetron men aatmavishwas dikhaya hai:",
      items: strengths,
      priority: 1,
    })

    recommendations.push({
      type: "PRACTICE_AREA",
      title: "Practice Areas",
      titleHi: "अभ्यास के क्षेत्र",
      titleHinglish: "Abhyas ke kshetron",
      description: "Areas where your child could benefit from additional practice:",
      descriptionHi: "ऐसे क्षेत्र जहां आपके बच्चे को अतिरिक्त अभ्यास की आवश्यकता हो सकती है:",
      descriptionHinglish: "Aapke bache ne nirdeshit kshetron men aatirikt abhyas ki avashyakata ho sakti hai:",
      items: practiceAreas,
      priority: 2,
    })

    // Generate activity recommendations based on weakest areas
    if (practiceAreas.length > 0) {
      const weakDomains = [...new Set(practiceAreas.map((a) => a.domain))]

      // Find activities for weak domains
      const activityPromises = weakDomains.map((domain) =>
        prisma.activity.findMany({
          where: { domainId: domain, status: "PUBLISHED", difficulty: "EASY" },
          take: 3,
        })
      )

      const weakDomainActivities = await Promise.all(activityPromises)

      recommendations.push({
        type: "ACTIVITY",
        title: "Recommended Activities",
        titleHi: "सुझावित गतिविधियां",
        titleHinglish: "Sujhavit gatividiyan",
        description: "Activities tailored to your child's practice areas:",
        descriptionHi: "आपके बच्चे के अभ्यास क्षेत्रों के अनुसार सुझाई गई गतिविधियां:",
        descriptionHinglish: "Aapke bache ne nirdeshit kshetron men aayi gatividiyan:",
        items: weakDomainActivities.flat().map((activity: any) => ({
          id: activity.id,
          title: activity.title,
          titleHi: activity.titleHi,
          titleHinglish: activity.titleHinglish,
          estimatedDuration: activity.estimatedDurationSec,
        })),
        priority: 3,
      })
    }

    // Generate offline activity recommendations
    if (practiceAreas.length > 0) {
      recommendations.push({
        type: "OFFLINE",
        title: "Offline Activities",
        titleHi: "ऑफ़लाइन गतिविधियां",
        titleHinglish: "Offline gatividiyan",
        description: "Real-world activities to reinforce learning:",
        descriptionHi: "सीखने को मजबूत करने के लिए वास्तविक दुनिया की गतिविधियां:",
        descriptionHinglish: "Sikhe ko mazboot karne ke liye vishavik duniya ki gatividiyan:",
        items: [
          {
            id: "offline_1",
            title: "Find objects of a specific color",
            titleHi: "एक विशेष रंग की वस्तुएं खोजना",
            description: "Ask your child to find 3-5 objects of a particular color around the house.",
          },
          {
            id: "offline_2",
            title: "Count everyday items",
            titleHi: "रोजाना की वस्तुओं की गिनती",
            description: "Count steps, plates, or fruits during daily routines.",
          },
        ],
        priority: 4,
      })
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}