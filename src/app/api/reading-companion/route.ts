import { groq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const recommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      author: z.string(),
      reason: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    const { userReviews } = await req.json()

    // Analyze user's reading preferences
    const recentBooks = userReviews.slice(0, 5).map((r: any) => ({
      title: r.book?.title || "Unknown",
      author: r.book?.author || "Unknown",
      rating: r.rating,
      review: r.review,
    }))

    const avgRating = userReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / (userReviews.length || 1)

    const prompt = `Based on this reader's history, recommend 3 books they would enjoy. These should be popular, well-known books from any genre.

Reader's Recent Reviews:
${recentBooks.map((b: any) => `- "${b.title}" by ${b.author} (rated ${b.rating}/5): ${b.review}`).join("\n")}

Average Rating Given: ${avgRating.toFixed(1)}/5

Provide 3 diverse book recommendations with:
1. Title and author
2. A brief reason (max 15 words) why they'd enjoy it based on their reading style

Focus on books that match their rating patterns and review style.`

    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: recommendationSchema,
      prompt,
      temperature: 0.8,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Recommendation error:", error)
    return Response.json(
      {
        recommendations: [
          {
            title: "The Midnight Library",
            author: "Matt Haig",
            reason: "A thought-provoking exploration of life's possibilities",
          },
          {
            title: "Project Hail Mary",
            author: "Andy Weir",
            reason: "Engaging science fiction with humor and heart",
          },
          {
            title: "The Seven Husbands of Evelyn Hugo",
            author: "Taylor Jenkins Reid",
            reason: "Compelling character-driven storytelling",
          },
        ],
      },
      { status: 200 },
    )
  }
}
