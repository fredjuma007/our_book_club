import { getServerClient, getMember } from "@/lib/wix"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the current member
    const member = await getMember()

    if (!member) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const client = await getServerClient()

    // Get all reviews
    const allReviews = await client.items
      .queryDataItems({
        dataCollectionId: "Reviews",
      })
      .find()

    // Get a sample of reviews (first 10)
    const sampleReviews = allReviews.items.slice(0, 10).map((item) => ({
      id: item._id,
      data: item.data,
    }))

    // Try to find reviews by this user
    const userReviews = allReviews.items.filter((item) => {
      // Check all possible user ID fields
      return (
        item.data?.userId === member.id ||
        item.data?.authorId === member.id ||
        item.data?.memberId === member.id ||
        item.data?.createdBy === member.id ||
        item.data?.userEmail === member.loginEmail
      )
    })

    return NextResponse.json({
      memberId: member.id,
      memberEmail: member.loginEmail,
      totalReviews: allReviews.items.length,
      userReviewsCount: userReviews.length,
      sampleReviews,
      userReviews: userReviews.map((item) => ({
        id: item._id,
        data: item.data,
      })),
    })
  } catch (error) {
    console.error("Debug reviews error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
