"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { getServerClient } from "@/lib/wix"

// Define the BookInsights interface
interface BookInsights {
  summary: string
  quotes: string[]
  authorBio: string
  themes: string[]
  discussionQuestions: string[]
  moodTone: {
    fun: number
    serious: number
    dark: number
    light: number
    emotional: number
    intellectual: number
  }
  recommendations: {
    title: string
    author: string
    reason: string
  }[]
}

// Default structure for book insights with explicit typing
const defaultInsightsStructure: BookInsights = {
  summary: "",
  quotes: [] as string[],
  authorBio: "",
  themes: [] as string[],
  discussionQuestions: [] as string[],
  moodTone: {
    fun: 50,
    serious: 50,
    dark: 50,
    light: 50,
    emotional: 50,
    intellectual: 50,
  },
  recommendations: [] as {
    title: string
    author: string
    reason: string
  }[],
}

// Enhance the JSON parsing with a more robust approach
// Replace the extractJsonFromText function with this improved version:

function extractJsonFromText(text: string): string | null {
  // First, check if the text is already valid JSON
  try {
    JSON.parse(text)
    return text
  } catch (e) {
    // Not valid JSON, continue with extraction
  }

  // Look for JSON between code block markers
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1]
  }

  // Try to find the most complete JSON object in the text
  try {
    // Find all potential JSON objects (starting with { and ending with })
    const jsonRegex = /(\{[\s\S]*?\})/g
    const matches = [...text.matchAll(jsonRegex)]

    // Try each match to find valid JSON
    for (const match of matches) {
      try {
        const possibleJson = match[0]
        JSON.parse(possibleJson)
        return possibleJson
      } catch (e) {
        // Not valid JSON, try the next match
        continue
      }
    }
  } catch (e) {
    // Continue to other methods if this approach fails
  }

  // If we still don't have a match, try a more aggressive approach
  // Find the first opening brace and the last closing brace
  const firstBrace = text.indexOf("{")
  const lastBrace = text.lastIndexOf("}")

  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    const jsonCandidate = text.substring(firstBrace, lastBrace + 1)

    // Try to fix common JSON issues
    try {
      // Replace any trailing commas before closing brackets or braces
      const fixedJson = jsonCandidate.replace(/,\s*([\]}])/g, "$1")
      JSON.parse(fixedJson)
      return fixedJson
    } catch (e) {
      // If that didn't work, return the original substring as a last resort
      return jsonCandidate
    }
  }

  return null
}

// Replace the cleanJsonString function with this improved version:

function cleanJsonString(jsonString: string): string {
  // Remove any code block markers
  let cleaned = jsonString.replace(/```json|```/g, "").trim()

  // Remove any file content or attachment references
  cleaned = cleaned.replace(/Attachment ".*?\.ts.*?/g, "")
  cleaned = cleaned.replace(/URL: https:\/\/.*?\.ts/g, "")

  // Replace escaped quotes with actual quotes
  cleaned = cleaned.replace(/\\"/g, '"')

  // Handle double escaped quotes if present
  cleaned = cleaned.replace(/\\\\/g, "\\")

  // Remove any backslashes before quotes that might cause issues
  cleaned = cleaned.replace(/([^\\])\\"/g, '$1"')

  // Fix any remaining escaped quotes
  cleaned = cleaned.replace(/\\"/g, '"')

  // Remove any "json" text that might appear at the beginning
  cleaned = cleaned.replace(/^json\s*/, "")

  // Fix trailing commas in objects and arrays (common JSON error)
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1")

  // Fix missing quotes around property names (another common JSON error)
  cleaned = cleaned.replace(/(\{|,)\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')

  return cleaned
}

// Replace the getBookInsights function with this more robust version:
export async function getBookInsights(
  bookId: string,
  bookTitle: string,
  bookAuthor: string,
  bookDescription: string,
): Promise<BookInsights> {
  try {
    // Get additional book data from Wix CMS
    const client = await getServerClient()
    let bookData = null

    try {
      const bookResponse = await client.items.get("Books", bookId)

      if (bookResponse) {
        bookData = bookResponse

        // Use the more detailed data if available
        if (bookData.title) bookTitle = bookData.title
        if (bookData.author) bookAuthor = bookData.author
        if (bookData.description) bookDescription = bookData.description
      }
    } catch (error) {
      console.error("Error fetching additional book data from Wix:", error)
      // Continue with the data we already have
    }

    // Create a prompt for the AI to generate insights about the book
    const prompt = `
      I need comprehensive insights about the book "${bookTitle}" by ${bookAuthor}.
      
      Here's a description of the book: "${bookDescription || "No description available"}"
      
      ${bookData?.genre ? `The book's genre is: ${bookData.genre}` : ""}
      ${bookData?.publisher ? `The book was recommended by: ${bookData.publisher}` : ""}
      ${bookData?.reviewDate ? `The book was reviewed on: ${bookData.reviewDate}` : ""}
      
      Please provide the following information in a structured JSON format:
      
      1. A concise summary of the book (2-3 paragraphs)
      2. 3-5 notable quotes from the book
      3. A brief biography of the author (1-2 paragraphs)
      4. 5-7 major themes or tropes in the book
      5. 3-5 thought-provoking discussion questions for a book club
      6. A mood/tone analysis with numerical values (0-100) for:
         - fun vs. serious
         - light vs. dark
         - emotional vs. intellectual
      7. 3 book recommendations for readers who enjoyed this book, including title, author, and a brief reason for the recommendation
      
      IMPORTANT: Your response must ONLY contain valid JSON that can be parsed with JSON.parse(). Do not include any text before or after the JSON. Do not use escape characters for quotes within strings - use single quotes inside double-quoted strings or vice versa.
      
      Format your response as valid JSON with the following structure:
      {
        "summary": "string",
        "quotes": ["string", "string", ...],
        "authorBio": "string",
        "themes": ["string", "string", ...],
        "discussionQuestions": ["string", "string", ...],
        "moodTone": {
          "fun": number,
          "serious": number,
          "dark": number,
          "light": number,
          "emotional": number,
          "intellectual": number
        },
        "recommendations": [
          {
            "title": "string",
            "author": "string",
            "reason": "string"
          },
          ...
        ]
      }
    `

    console.log(`Generating insights for book: ${bookTitle} by ${bookAuthor}`)

    // Generate insights using Groq AI
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: prompt,
      temperature: 0.8,
      maxTokens: 2000,
      topP: 0.9,
    })

    // Log the raw response for debugging
    console.log("Raw AI response:", text.substring(0, 200) + "...")

    // SKIP JSON PARSING ENTIRELY - Use regex-based extraction instead
    // This is more reliable for handling incomplete or malformed JSON
    const insights = extractInsightsWithRegex(text, bookTitle, bookAuthor)

    // Validate and fill in any missing fields
    const validatedInsights = validateAndFixInsights(insights)

    console.log("Successfully generated AI insights")
    return validatedInsights
  } catch (error) {
    console.error("Error generating book insights:", error)

    // Create fallback insights when everything else fails
    return createFallbackInsights(bookTitle, bookAuthor)
  }
}

// Add this new function to extract insights using regex instead of JSON parsing
function extractInsightsWithRegex(text: string, bookTitle: string, bookAuthor: string): Partial<BookInsights> {
  const insights: Partial<BookInsights> = {}

  // Extract summary
  const summaryMatch = text.match(/"summary"\s*:\s*"([^"]+)"/s)
  if (summaryMatch && summaryMatch[1]) {
    insights.summary = summaryMatch[1].trim()
  }

  // Extract quotes
  const quotesSection = text.match(/"quotes"\s*:\s*\[(.*?)\]/s)
  if (quotesSection && quotesSection[1]) {
    const quoteMatches = quotesSection[1].match(/"([^"]+)"/g)
    if (quoteMatches) {
      insights.quotes = quoteMatches.map((q) => q.replace(/^"|"$/g, ""))
    }
  }

  // Extract author bio
  const authorBioMatch = text.match(/"authorBio"\s*:\s*"([^"]+)"/s)
  if (authorBioMatch && authorBioMatch[1]) {
    insights.authorBio = authorBioMatch[1].trim()
  }

  // Extract themes
  const themesSection = text.match(/"themes"\s*:\s*\[(.*?)\]/s)
  if (themesSection && themesSection[1]) {
    const themeMatches = themesSection[1].match(/"([^"]+)"/g)
    if (themeMatches) {
      insights.themes = themeMatches.map((t) => t.replace(/^"|"$/g, ""))
    }
  }

  // Extract discussion questions
  const questionsSection = text.match(/"discussionQuestions"\s*:\s*\[(.*?)\]/s)
  if (questionsSection && questionsSection[1]) {
    const questionMatches = questionsSection[1].match(/"([^"]+)"/g)
    if (questionMatches) {
      insights.discussionQuestions = questionMatches.map((q) => q.replace(/^"|"$/g, ""))
    }
  }

  // Extract mood/tone
  insights.moodTone = {
    fun: 50,
    serious: 50,
    dark: 50,
    light: 50,
    emotional: 50,
    intellectual: 50,
  }

  const funMatch = text.match(/"fun"\s*:\s*(\d+)/s)
  if (funMatch && funMatch[1]) {
    insights.moodTone.fun = Number.parseInt(funMatch[1], 10)
  }

  const seriousMatch = text.match(/"serious"\s*:\s*(\d+)/s)
  if (seriousMatch && seriousMatch[1]) {
    insights.moodTone.serious = Number.parseInt(seriousMatch[1], 10)
  }

  const darkMatch = text.match(/"dark"\s*:\s*(\d+)/s)
  if (darkMatch && darkMatch[1]) {
    insights.moodTone.dark = Number.parseInt(darkMatch[1], 10)
  }

  const lightMatch = text.match(/"light"\s*:\s*(\d+)/s)
  if (lightMatch && lightMatch[1]) {
    insights.moodTone.light = Number.parseInt(lightMatch[1], 10)
  }

  const emotionalMatch = text.match(/"emotional"\s*:\s*(\d+)/s)
  if (emotionalMatch && emotionalMatch[1]) {
    insights.moodTone.emotional = Number.parseInt(emotionalMatch[1], 10)
  }

  const intellectualMatch = text.match(/"intellectual"\s*:\s*(\d+)/s)
  if (intellectualMatch && intellectualMatch[1]) {
    insights.moodTone.intellectual = Number.parseInt(intellectualMatch[1], 10)
  }

  // Extract recommendations
  insights.recommendations = []

  // Look for recommendation objects
  const recommendationsSection = text.match(/"recommendations"\s*:\s*\[(.*?)\]/s)
  if (recommendationsSection && recommendationsSection[1]) {
    // Split by closing and opening braces to find individual recommendation objects
    const recObjects = recommendationsSection[1].split(/},\s*{/)

    recObjects.forEach((recObj, index) => {
      // Add opening brace if it's not the first object
      if (index > 0) {
        recObj = "{" + recObj
      }
      // Add closing brace if it's not the last object
      if (index < recObjects.length - 1 && !recObj.endsWith("}")) {
        recObj = recObj + "}"
      }

      const titleMatch = recObj.match(/"title"\s*:\s*"([^"]+)"/s)
      const authorMatch = recObj.match(/"author"\s*:\s*"([^"]+)"/s)
      const reasonMatch = recObj.match(/"reason"\s*:\s*"([^"]+)"/s)

      if (titleMatch || authorMatch) {
        if (!insights.recommendations) {
          insights.recommendations = []
        }
        insights.recommendations.push({
          title: titleMatch ? titleMatch[1] : `Book similar to ${bookTitle}`,
          author: authorMatch ? authorMatch[1] : "Recommended Author",
          reason: reasonMatch ? reasonMatch[1] : `For fans of ${bookAuthor}'s writing style.`,
        })
      }
    })
  }

  // If no recommendations were found, create default ones
  if (!insights.recommendations || insights.recommendations.length === 0) {
    insights.recommendations = [
      {
        title: `Books similar to ${bookTitle}`,
        author: "Various Authors",
        reason: `For fans of ${bookAuthor}'s writing style and themes.`,
      },
      {
        title: "Related Literary Work",
        author: "Contemporary Author",
        reason: "Explores similar themes with a different perspective.",
      },
      {
        title: "Classic in the Genre",
        author: "Renowned Writer",
        reason: "A foundational work that influenced this style of literature.",
      },
    ]
  }

  return insights
}

// Add this new function to create fallback insights when everything else fails
function createFallbackInsights(bookTitle: string, bookAuthor: string): BookInsights {
  return {
    summary: `"${bookTitle}" is a compelling work by ${bookAuthor} that explores universal themes and captivates readers with its engaging narrative. The book takes readers on a journey through complex characters and thought-provoking situations.`,
    quotes: [
      "Notable quote from the book would appear here.",
      "Another memorable line from the text.",
      "A third significant quote from the work.",
    ],
    authorBio: `${bookAuthor} is a talented writer known for creating engaging stories with memorable characters. Their work often explores themes that resonate with readers across different backgrounds.`,
    themes: ["Character Development", "Relationships", "Identity", "Conflict Resolution", "Personal Growth"],
    discussionQuestions: [
      `What did you think about the main character's journey in "${bookTitle}"?`,
      "How did the author's writing style contribute to the overall experience?",
      "Which themes resonated with you the most and why?",
    ],
    moodTone: {
      fun: 50,
      serious: 50,
      dark: 50,
      light: 50,
      emotional: 50,
      intellectual: 50,
    },
    recommendations: [
      {
        title: `Books similar to ${bookTitle}`,
        author: "Various Authors",
        reason: `For fans of ${bookAuthor}'s writing style and themes.`,
      },
      {
        title: "Related Literary Work",
        author: "Contemporary Author",
        reason: "Explores similar themes with a different perspective.",
      },
      {
        title: "Classic in the Genre",
        author: "Renowned Writer",
        reason: "A foundational work that influenced this style of literature.",
      },
    ],
  }
}

// Add this new function to manually extract insights from malformed JSON
function createManualInsights(jsonText: string, bookTitle: string, bookAuthor: string): Partial<BookInsights> {
  const insights: Partial<BookInsights> = {}

  // Try to extract summary
  const summaryMatch = jsonText.match(/"summary"\s*:\s*"([^"]+)"/)
  if (summaryMatch && summaryMatch[1]) {
    insights.summary = summaryMatch[1]
  }

  // Try to extract quotes
  const quotesMatches = jsonText.match(/"quotes"\s*:\s*\[(.*?)\]/s)
  if (quotesMatches && quotesMatches[1]) {
    const quotesText = quotesMatches[1]
    const quotes = quotesText.match(/"([^"]+)"/g)
    if (quotes) {
      insights.quotes = quotes.map((q) => q.replace(/^"|"$/g, ""))
    }
  }

  // Try to extract author bio
  const authorBioMatch = jsonText.match(/"authorBio"\s*:\s*"([^"]+)"/)
  if (authorBioMatch && authorBioMatch[1]) {
    insights.authorBio = authorBioMatch[1]
  }

  // Try to extract themes
  const themesMatches = jsonText.match(/"themes"\s*:\s*\[(.*?)\]/s)
  if (themesMatches && themesMatches[1]) {
    const themesText = themesMatches[1]
    const themes = themesText.match(/"([^"]+)"/g)
    if (themes) {
      insights.themes = themes.map((t) => t.replace(/^"|"$/g, ""))
    }
  }

  // Try to extract discussion questions
  const questionsMatches = jsonText.match(/"discussionQuestions"\s*:\s*\[(.*?)\]/s)
  if (questionsMatches && questionsMatches[1]) {
    const questionsText = questionsMatches[1]
    const questions = questionsText.match(/"([^"]+)"/g)
    if (questions) {
      insights.discussionQuestions = questions.map((q) => q.replace(/^"|"$/g, ""))
    }
  }

  // Try to extract mood/tone
  const moodToneMatch = jsonText.match(/"moodTone"\s*:\s*\{(.*?)\}/s)
  if (moodToneMatch && moodToneMatch[1]) {
    const moodToneText = moodToneMatch[1]
    insights.moodTone = {
      fun: 50,
      serious: 50,
      dark: 50,
      light: 50,
      emotional: 50,
      intellectual: 50,
    }

    // Extract individual mood values
    const funMatch = moodToneText.match(/"fun"\s*:\s*(\d+)/)
    if (funMatch && funMatch[1]) {
      insights.moodTone.fun = Number.parseInt(funMatch[1], 10)
    }

    const seriousMatch = moodToneText.match(/"serious"\s*:\s*(\d+)/)
    if (seriousMatch && seriousMatch[1]) {
      insights.moodTone.serious = Number.parseInt(seriousMatch[1], 10)
    }

    const darkMatch = moodToneText.match(/"dark"\s*:\s*(\d+)/)
    if (darkMatch && darkMatch[1]) {
      insights.moodTone.dark = Number.parseInt(darkMatch[1], 10)
    }

    const lightMatch = moodToneText.match(/"light"\s*:\s*(\d+)/)
    if (lightMatch && lightMatch[1]) {
      insights.moodTone.light = Number.parseInt(lightMatch[1], 10)
    }

    const emotionalMatch = moodToneText.match(/"emotional"\s*:\s*(\d+)/)
    if (emotionalMatch && emotionalMatch[1]) {
      insights.moodTone.emotional = Number.parseInt(emotionalMatch[1], 10)
    }

    const intellectualMatch = moodToneText.match(/"intellectual"\s*:\s*(\d+)/)
    if (intellectualMatch && intellectualMatch[1]) {
      insights.moodTone.intellectual = Number.parseInt(intellectualMatch[1], 10)
    }
  }

  // Create default recommendations if none are found
  insights.recommendations = [
    {
      title: `Books similar to ${bookTitle}`,
      author: "Various Authors",
      reason: `For fans of ${bookAuthor}'s writing style and themes.`,
    },
    {
      title: "Related Literary Work",
      author: "Contemporary Author",
      reason: "Explores similar themes with a different perspective.",
    },
    {
      title: "Classic in the Genre",
      author: "Renowned Writer",
      reason: "A foundational work that influenced this style of literature.",
    },
  ]

  // Try to extract recommendations
  const recommendationsMatch = jsonText.match(/"recommendations"\s*:\s*\[(.*?)\]/s)
  if (recommendationsMatch && recommendationsMatch[1]) {
    const recommendationsText = recommendationsMatch[1]
    const recommendations: { title: string; author: string; reason: string }[] = []

    // Try to find individual recommendation objects
    const recObjects = recommendationsText.split("},")

    recObjects.forEach((recObj) => {
      const titleMatch = recObj.match(/"title"\s*:\s*"([^"]+)"/)
      const authorMatch = recObj.match(/"author"\s*:\s*"([^"]+)"/)
      const reasonMatch = recObj.match(/"reason"\s*:\s*"([^"]+)"/)

      if (titleMatch && authorMatch) {
        recommendations.push({
          title: titleMatch[1],
          author: authorMatch[1],
          reason: reasonMatch ? reasonMatch[1] : "Similar themes and writing style.",
        })
      }
    })

    if (recommendations.length > 0) {
      insights.recommendations = recommendations
    }
  }

  return insights
}

// Function to validate and fix the insights structure
function validateAndFixInsights(insights: Partial<BookInsights>): BookInsights {
  const result: BookInsights = { ...defaultInsightsStructure }

  // Copy valid fields from the insights
  if (typeof insights.summary === "string") {
    // Clean up the summary - remove any file content or code references
    const cleanSummary = insights.summary
      .replace(/Attachment ".*?\.ts.*?/g, "")
      .replace(/URL: https:\/\/.*?\.ts/g, "")
      .replace(/"use server"[\s\S]*?export async function/g, "")

    result.summary = cleanSummary
  }

  if (Array.isArray(insights.quotes)) result.quotes = insights.quotes
  else if (typeof insights.quotes === "string") result.quotes = [insights.quotes]

  if (typeof insights.authorBio === "string") result.authorBio = insights.authorBio

  if (Array.isArray(insights.themes)) {
    // Clean up themes - remove any that look like file content
    result.themes = insights.themes.filter(
      (theme) => !theme.includes("Attachment") && !theme.includes("URL:") && !theme.includes("use server"),
    )
  } else if (typeof insights.themes === "string") result.themes = [insights.themes]

  if (Array.isArray(insights.discussionQuestions)) result.discussionQuestions = insights.discussionQuestions
  else if (typeof insights.discussionQuestions === "string") result.discussionQuestions = [insights.discussionQuestions]

  // Handle mood/tone
  if (insights.moodTone) {
    if (typeof insights.moodTone.fun === "number") result.moodTone.fun = insights.moodTone.fun
    if (typeof insights.moodTone.serious === "number") result.moodTone.serious = insights.moodTone.serious
    if (typeof insights.moodTone.dark === "number") result.moodTone.dark = insights.moodTone.dark
    if (typeof insights.moodTone.light === "number") result.moodTone.light = insights.moodTone.light
    if (typeof insights.moodTone.emotional === "number") result.moodTone.emotional = insights.moodTone.emotional
    if (typeof insights.moodTone.intellectual === "number")
      result.moodTone.intellectual = insights.moodTone.intellectual
  }

  // Handle recommendations
  if (Array.isArray(insights.recommendations)) {
    result.recommendations = insights.recommendations.map((rec) => ({
      title: rec.title || "Unknown Title",
      author: rec.author || "Unknown Author",
      reason: rec.reason || "Similar themes and writing style.",
    }))
  }

  return result
}

// Function to attempt to structure unstructured response
function attemptToStructureResponse(text: string, bookTitle: string, bookAuthor: string): BookInsights {
  // This is a fallback function that tries to extract information from unstructured text
  // It's not perfect but might help in some cases

  const result: BookInsights = { ...defaultInsightsStructure }

  // Clean the text from any file content or code references
  const cleanedText = text
    .replace(/Attachment ".*?\.ts.*?/g, "")
    .replace(/URL: https:\/\/.*?\.ts/g, "")
    .replace(/"use server"[\s\S]*?export async function/g, "")

  // Try to extract summary (first paragraph)
  const paragraphs = cleanedText.split("\n\n").filter((p) => p.trim().length > 0)
  if (paragraphs.length > 0) {
    result.summary = paragraphs[0]
  }

  // Look for quotes (often in quotation marks)
  const quoteMatches = cleanedText.match(/"([^"]+)"/g) || cleanedText.match(/'([^']+)'/g)
  if (quoteMatches && quoteMatches.length > 0) {
    result.quotes = quoteMatches.slice(0, 5).map((q) => q.replace(/^["']|["']$/g, ""))
  }

  // Look for author bio (often contains the author's name)
  const authorBioParagraphs = paragraphs.filter(
    (p) =>
      p.includes(bookAuthor) &&
      (p.includes("born") || p.includes("author") || p.includes("writer") || p.includes("career")),
  )
  if (authorBioParagraphs.length > 0) {
    result.authorBio = authorBioParagraphs[0]
  }

  // Look for themes (often listed with keywords like "theme", "explores", "deals with")
  const themeParagraphs = paragraphs.filter(
    (p) => p.includes("theme") || p.includes("explores") || p.includes("deals with"),
  )
  if (themeParagraphs.length > 0) {
    const themeText = themeParagraphs[0]
    const possibleThemes = themeText.split(/[,.]/).filter((t) => t.trim().length > 0)
    result.themes = possibleThemes.slice(0, 7).map((t) => t.trim())
  }

  // Look for questions (sentences ending with question marks)
  const questionMatches = cleanedText.match(/[^.!?]+\?/g)
  if (questionMatches && questionMatches.length > 0) {
    result.discussionQuestions = questionMatches.slice(0, 5).map((q) => q.trim())
  }

  // For recommendations, we'll have to make educated guesses
  result.recommendations = [
    {
      title: "Similar Book",
      author: "Another Author",
      reason: "Shares similar themes and writing style.",
    },
    {
      title: "Related Work",
      author: "Different Writer",
      reason: "Explores complementary ideas and concepts.",
    },
  ]

  return result
}
