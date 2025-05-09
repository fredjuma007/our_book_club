"use server"

import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import type { Book, BookTag } from "@/lib/book-types"

// Enrich books with tags if they don't have them
export async function enrichBooksWithTags(books: Book[]): Promise<Book[]> {
  const booksToEnrich = books.filter((book) => !book.tags)

  if (booksToEnrich.length === 0) {
    return books
  }

  const enrichedBooks = [...books]

  // Process books in batches to avoid rate limits
  for (const book of booksToEnrich) {
    try {
      const index = enrichedBooks.findIndex((b) => b._id === book._id)
      if (index !== -1) {
        const tags = await generateBookTags(book)
        enrichedBooks[index] = {
          ...enrichedBooks[index],
          tags,
        }
      }
    } catch (error) {
      console.error(`Error enriching book ${book.title}:`, error)
    }
  }

  return enrichedBooks
}

// Generate tags for a book using Groq
async function generateBookTags(book: Book): Promise<BookTag> {
  try {
    // Create a more specific prompt for better tag generation
    const prompt = `
      Book Title: ${book.title}
      Author: ${book.author}
      Genre: ${book.genre || "Unknown"}
      ${book.summary ? `Summary: ${book.summary}` : ""}
      
      Based on the information above, generate detailed and accurate tags for this book in the following categories:
      1. Mood (e.g., magical, whimsical, dark, uplifting, melancholic, suspenseful)
      2. Themes (e.g., magic, fantasy, adventure, love, loss, redemption, coming-of-age)
      3. Discussion topics (e.g., ethics, relationships, social issues, supernatural elements)
      
      Be specific and accurate. If the book involves magic, fantasy, or supernatural elements, be sure to include those tags.
      Format your response as a JSON object with these three categories as arrays.
      Example: {"mood":["magical","whimsical"],"themes":["fantasy","adventure"],"discussion_topics":["supernatural elements","friendship"]}
    `

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: `You are a literary expert who specializes in categorizing books accurately. Respond only with the requested JSON format.
      
      ${prompt}`,
    })

    // Extract JSON from response
    const jsonMatch = text.match(/\{.*\}/s)
    if (jsonMatch) {
      const jsonStr = jsonMatch[0]
      return JSON.parse(jsonStr)
    }

    // Fallback tags if parsing fails
    return generateFallbackTags(book)
  } catch (error) {
    console.error("Error generating tags:", error)
    return generateFallbackTags(book)
  }
}

// Generate fallback tags based on book metadata
function generateFallbackTags(book: Book): BookTag {
  const tags: BookTag = {
    mood: [],
    themes: [],
    discussion_topics: [],
  }

  // Add genre-based tags
  if (book.genre) {
    const genreLower = book.genre.toLowerCase()

    // Fantasy books
    if (genreLower.includes("fantasy") || genreLower.includes("magic")) {
      tags.mood = tags.mood || []
      tags.mood.push("magical", "fantastical")
      tags.themes = tags.themes || []
      tags.themes.push("fantasy", "magic")
      tags.discussion_topics = tags.discussion_topics || []
      tags.discussion_topics.push("supernatural elements")
    }

    // Science fiction
    if (genreLower.includes("sci-fi") || genreLower.includes("science fiction")) {
      tags.mood = tags.mood || []
      tags.mood.push("futuristic", "speculative")
      tags.themes = tags.themes || []
      tags.themes.push("technology", "future")
      tags.discussion_topics = tags.discussion_topics || []
      tags.discussion_topics.push("scientific ethics")
    }

    // Mystery
    if (genreLower.includes("mystery") || genreLower.includes("thriller")) {
      tags.mood = tags.mood || []
      tags.mood.push("suspenseful", "intriguing")
      tags.themes = tags.themes || []
      tags.themes.push("mystery", "investigation")
      tags.discussion_topics = tags.discussion_topics || []
      tags.discussion_topics.push("crime", "justice")
    }

    // Romance
    if (genreLower.includes("romance")) {
      tags.mood = tags.mood || []
      tags.mood.push("romantic", "emotional")
      tags.themes = tags.themes || []
      tags.themes.push("love", "relationships")
      tags.discussion_topics = tags.discussion_topics || []
      tags.discussion_topics.push("romance", "human connection")
    }
  }

  // Check author for known fantasy/magic authors
  if (book.author) {
    const authorLower = book.author.toLowerCase()
    const fantasyAuthors = [
      "neil gaiman",
      "j.k. rowling",
      "terry pratchett",
      "brandon sanderson",
      "george r.r. martin",
      "ursula k. le guin",
      "patrick rothfuss",
      "v.e. schwab",
      "leigh bardugo",
      "sarah j. maas",
      "j.r.r. tolkien",
      "diana wynne jones",
    ]

    if (fantasyAuthors.some((author) => authorLower.includes(author))) {
      tags.mood = tags.mood || []
      tags.mood = tags.mood || [];
      if (!tags.mood.includes("magical")) tags.mood.push("magical");
      tags.themes = tags.themes || []
      if (!tags.themes.includes("fantasy")) tags.themes.push("fantasy")
      tags.themes = tags.themes || [];
      if (!tags.themes.includes("magic")) tags.themes.push("magic");
      tags.discussion_topics = tags.discussion_topics || []
      if (!tags.discussion_topics.includes("supernatural elements"))
        tags.discussion_topics.push("supernatural elements")
    }
  }

  // Check title for magic-related keywords
  if (book.title) {
    const titleLower = book.title.toLowerCase()
    const magicKeywords = [
      "magic",
      "spell",
      "witch",
      "wizard",
      "sorcery",
      "enchant",
      "fairy",
      "dragon",
      "myth",
      "legend",
      "fantasy",
      "supernatural",
      "ghost",
      "spirit",
    ]

    if (magicKeywords.some((keyword) => titleLower.includes(keyword))) {
      tags.mood = tags.mood || [];
      if (!tags.mood.includes("magical")) tags.mood.push("magical");
      tags.themes = tags.themes || [];
      if (!tags.themes.includes("magic")) tags.themes.push("magic");
    }
  }

  // If we still have no tags, add generic ones
  if (!tags.mood) tags.mood = [];
  if (tags.mood.length === 0) tags.mood.push("unknown");
  if (!tags.themes) tags.themes = [];
  if (tags.themes.length === 0) tags.themes.push("literature");
  if (!tags.discussion_topics) tags.discussion_topics = [];
  if (tags.discussion_topics.length === 0) tags.discussion_topics.push("book club");

  return tags
}
