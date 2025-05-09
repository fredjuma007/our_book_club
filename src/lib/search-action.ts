"use server"

import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { getServerClient } from "@/lib/wix"
import type { Book, BookWithMatch } from "@/lib/book-types"
import { enrichBooksWithTags } from "@/lib/search-utils"

// Cache for book embeddings to avoid recalculating
const bookEmbeddingsCache: { [key: string]: number[] } = {}

export async function semanticSearch(query: string): Promise<BookWithMatch[]> {
  try {
    // Get books from Wix CMS
    const client = await getServerClient()
    const booksData = await client.items
      .queryDataItems({ dataCollectionId: "Books" })
      .find()
      .then((res) => res.items.map((item) => item.data || {}))

    // Filter out any null or undefined values
    const books = booksData.filter((book): book is Book => !!book && typeof book === "object")

    // Enrich books with tags if they don't have them
    const enrichedBooks = await enrichBooksWithTags(books)

    // Use direct keyword matching first for better accuracy
    const keywordMatches = findKeywordMatches(query, enrichedBooks)

    // If we have good keyword matches, prioritize them
    if (keywordMatches.length >= 3) {
      const booksWithExplanations = await addExplanationsToBooks(query, keywordMatches)
      return booksWithExplanations
    }

    // Otherwise, use the LLM to find the best matches
    const llmMatches = await findLLMMatches(query, enrichedBooks)
    return llmMatches
  } catch (error) {
    console.error("Semantic search error:", error)
    throw new Error("Failed to perform semantic search")
  }
}

// Find matches based on keywords in the query
function findKeywordMatches(query: string, books: Book[]): BookWithMatch[] {
  const queryTerms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 2)
  const querySet = new Set(queryTerms)

  // Score each book based on keyword matches
  const scoredBooks = books.map((book) => {
    let score = 0
    const bookText = `${book.title} ${book.author} ${book.genre || ""} ${book.summary || ""}`.toLowerCase()

    // Check for exact phrase match (highest score)
    if (bookText.includes(query.toLowerCase())) {
      score += 100
    }

    // Check for individual term matches
    for (const term of querySet) {
      if (bookText.includes(term)) {
        score += 10
      }

      // Extra points for title matches
      if (book.title?.toLowerCase().includes(term)) {
        score += 20
      }

      // Extra points for genre matches
      if (book.genre?.toLowerCase().includes(term)) {
        score += 15
      }

      // Check tags if available
      if (book.tags) {
        // Check mood tags
        if (book.tags.mood?.some((tag) => tag.toLowerCase().includes(term))) {
          score += 15
        }

        // Check theme tags
        if (book.tags.themes?.some((tag) => tag.toLowerCase().includes(term))) {
          score += 15
        }

        // Check discussion topics
        if (book.tags.discussion_topics?.some((tag) => tag.toLowerCase().includes(term))) {
          score += 10
        }
      }
    }

    // Normalize score to 0-1 range
    const normalizedScore = Math.min(score / 100, 1)

    return {
      ...book,
      matchScore: normalizedScore,
    }
  })

  // Sort by score and get top matches
  const sortedBooks = scoredBooks
    .filter((book) => book.matchScore > 0.1) // Only include books with decent matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)

  return sortedBooks
}

// Find matches using the LLM
async function findLLMMatches(query: string, books: Book[]): Promise<BookWithMatch[]> {
  try {
    // Create a prompt with the query and all books
    const bookDescriptions = books
      .map((book, index) => {
        return `Book ${index + 1}: "${book.title}" by ${book.author}
Genre: ${book.genre || "Unknown"}
${book.summary ? `Summary: ${book.summary}` : ""}
${book.tags ? `Tags - Mood: ${book.tags.mood?.join(", ") || "None"}. Themes: ${book.tags.themes?.join(", ") || "None"}. Discussion topics: ${book.tags.discussion_topics?.join(", ") || "None"}.` : ""}
`
      })
      .join("\n\n")

    // Use Groq to find the best matches
    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: `You are a book recommendation expert. Given the following query and list of books, identify the top 5 books that best match the query. Focus on finding books that truly match the query's intent.

Query: "${query}"

Books:
${bookDescriptions}

Return your answer as a JSON array with the following format:
[
  {"index": 1, "score": 0.95, "reason": "Short explanation of why this book matches"},
  {"index": 4, "score": 0.82, "reason": "Short explanation of why this book matches"},
  ...
]

Only include books that genuinely match the query. If fewer than 5 books match, return fewer results. Score should be between 0 and 1, with 1 being a perfect match.`,
    })

    // Parse the response
    const jsonMatch = text.match(/\[[\s\S]*\]/m)
    if (!jsonMatch) {
      throw new Error("Failed to parse LLM response")
    }

    const matches = JSON.parse(jsonMatch[0])

    // Map the matches back to the original books
    const matchedBooks = matches.map((match: { index: number; score: any; reason: any }) => {
      const book = books[match.index - 1]
      return {
        ...book,
        matchScore: match.score,
        matchReason: match.reason,
      }
    })

    return matchedBooks
  } catch (error) {
    console.error("Error finding LLM matches:", error)
    // Fallback to simple keyword matching if LLM fails
    return findKeywordMatches(query, books)
  }
}

// Add explanations to books that were matched by keywords
async function addExplanationsToBooks(query: string, books: BookWithMatch[]): Promise<BookWithMatch[]> {
  return Promise.all(
    books.map(async (book) => {
      try {
        const { text } = await generateText({
          model: groq("llama3-8b-8192"),
          prompt: `Explain in ONE SHORT SENTENCE (max 15 words) why this book matches the query "${query}":
        
Book: "${book.title}" by ${book.author}
Genre: ${book.genre || "Unknown"}
${book.summary ? `Summary: ${book.summary}` : ""}
${book.tags ? `Tags - Mood: ${book.tags.mood?.join(", ") || "None"}. Themes: ${book.tags.themes?.join(", ") || "None"}. Discussion topics: ${book.tags.discussion_topics?.join(", ") || "None"}.` : ""}`,
        })

        return {
          ...book,
          matchReason: text.trim(),
        }
      } catch (error) {
        console.error("Error generating explanation:", error)
        return {
          ...book,
          matchReason: `This book matches your search for "${query}".`,
        }
      }
    }),
  )
}
