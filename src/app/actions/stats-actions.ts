"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface Book {
  _id?: string
  title?: string
  author?: string
  genre?: string
  [key: string]: any
}

interface Recommendation {
  title: string
  author: string
  reason: string
  goodreadsId?: string
}

export async function generateAIRecommendations(
  topGenres: string[],
  topAuthors: string[],
  recentBooks: string[],
): Promise<Recommendation[]> {
  try {
    // Create prompt for AI
    const prompt = `
      Based on the reading history of our book club, please recommend 5 books we might enjoy.
      
      Top genres: ${topGenres.join(", ")}
      Top authors: ${topAuthors.join(", ")}
      Recently read books: ${recentBooks.join(", ")}
      
      Please provide recommendations in this JSON format:
      [
        {
          "title": "Book Title",
          "author": "Author Name",
          "reason": "A brief reason why this book would appeal to our club based on our reading history",
          "goodreadsId": "Goodreads ID if you know it (optional)"
        }
      ]
      
      Only return the JSON array, nothing else.
    `

    // Use AI to generate recommendations
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const jsonText = jsonMatch[0]
      try {
        const parsedRecommendations = JSON.parse(jsonText)
        return parsedRecommendations.slice(0, 5)
      } catch (error) {
        console.error("Error parsing AI response:", error)
        return getFallbackRecommendations()
      }
    } else {
      return getFallbackRecommendations()
    }
  } catch (error) {
    console.error("Error generating AI recommendations:", error)
    return getFallbackRecommendations()
  }
}

function getFallbackRecommendations(): Recommendation[] {
  return [
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      reason:
        "A philosophical novel about life's possibilities and choices that appeals to readers who enjoy thought-provoking fiction.",
      goodreadsId: "52578297",
    },
    {
      title: "Circe",
      author: "Madeline Miller",
      reason:
        "A mythological retelling with rich character development and beautiful prose, perfect for book clubs that appreciate literary fiction.",
      goodreadsId: "35959740",
    },
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      reason:
        "A compelling story about a Hollywood icon with complex characters and emotional depth that sparks great discussions.",
      goodreadsId: "32620332",
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      reason:
        "An engaging sci-fi adventure with a perfect blend of science and heart, ideal for clubs that enjoy problem-solving narratives.",
      goodreadsId: "54493401",
    },
    {
      title: "The House in the Cerulean Sea",
      author: "TJ Klune",
      reason:
        "A heartwarming fantasy about found family and acceptance that offers a delightful escape with meaningful themes.",
      goodreadsId: "45047384",
    },
  ]
}
