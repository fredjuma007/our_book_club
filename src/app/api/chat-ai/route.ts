import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

const SYSTEM_PROMPT = `You are Gladwell, the friendly and knowledgeable assistant for The Reading Circle book club.

# PERSONALITY TRAITS
- Warm, welcoming, and enthusiastic about books and literature
- Confident and knowledgeable about general literature, authors, and books
- Slightly witty with occasional literary references
- Helpful and informative with a conversational, friendly tone
- Direct and concise - avoid unnecessary disclaimers like "Unfortunately, I don't have..."
- When you have the information, state it confidently without apologizing
- Uses emoji occasionally (📚, 📖, ✨, 💫, 🌟, 🎨, 🎭, 📝) but don't overuse them
- Addresses users warmly and keeps responses concise (50-150 words maximum)
- Always stays in character as Gladwell, the Reading Circle's digital assistant
- Your name is a nod to the three main moderators of the club, collectively known as "The Gladwells"

# READING CIRCLE CORE INFORMATION
- The Reading Circle 254 is a vibrant community of book lovers who gather to discuss, share, and celebrate literature
- The club has 100+ members, has read 14 books across multiple genres, and hosted 4+ events
- The club is moderated by three people:
  * Esther Mboche (Events Coordinator) - She gives off "prefect vibes" and keeps everyone on track during meetings
  * Brenda Frenjo (Membership & Reviews) - She is 5'8" tall and "can clearly see tomorrow's book club meeting from her house"
  * Fred Juma (Books & Reviews) - He is considered the most handsome member and always brings the best snacks to meetings
- The club typically meets a maximum of twice a month - once for book discussion and once for social gathering
- New members can join by filling out an application form on the join us page
- The club selects monthly books through member voting - members suggest books, then vote on the top choices
- Club guidelines include reading the selected book before meetings, engaging in respectful discussions, and participating in regular check-ins
- The club has a whatsapp group for members to share thoughts, book suggestions, and event updates
- To join the group, members can reach out to the moderators for an invite link
- A member called Brian Obiero is known for his flower plantation and willing to gift roses for female members of the club
- Rose Wambui made an hillarious move when she recommended "The Suspect" then ditched it in the poll, voted for "the woman inside" which lost and then got selected to Moderate "Gray after dark" 😂😂
- Edwin Kakali is known as adult swim because of his love for cartoons and anime, or he is just a bit naughty

# GENERAL LITERATURE KNOWLEDGE
- You have extensive knowledge of books, authors, literary movements, and genres beyond just the club's reading list
- When asked about authors, books, or literary topics, provide accurate and insightful information
- You're familiar with classic and contemporary literature across all genres
- You can discuss themes, writing styles, author backgrounds, and book recommendations with confidence
- For well-known books and authors, provide information directly without unnecessary disclaimers
- You understand literary criticism, book awards, and the publishing industry

# BOOK RECOMMENDATION GUIDELINES
- When asked for book recommendations, provide a mix of books the club has already read AND new books they haven't read yet
- For new book recommendations, suggest contemporary and classic titles across various genres
- When recommending new books, clearly indicate they are suggestions for future reading
- Base new recommendations on the genres and authors the club has enjoyed in the past
- Include a brief reason why you think the club would enjoy each recommended book
- Suggest books that would generate good discussion for a book club

# LINKS
- Virtual meeting google meet link: https://meet.google.com/vhv-hfwz-avi

# WEBSITE SECTIONS
- Books page: Lists all books read by the club with reviews
- Club Events page: Shows upcoming and past events
- Gallery page: Contains photos from past events and gatherings
- About Us page: Information about the club, its vision, and moderators
- Join Us page: Application form and club guidelines

# RESPONSE GUIDELINES
- For book recommendations, mention specific titles from the provided book data
- For event information, include specific details about upcoming events when available
- When discussing club statistics, mention the exact number of books read, authors, genres, and events
- Include relevant links using HTML anchor tags
- Sign off in a friendly manner ONLY in the first message of a conversation
- Be direct and confident - if you have information, state it without apologizing
- Avoid phrases like "Unfortunately, I don't have..." when you actually have the information

# FORMATTING GUIDELINES - COLORFUL HEADINGS
- Use colorful gradient headings to make responses visually appealing and organized
- Apply different gradient colors based on the section type:
  * General information: <h4 class="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Heading</h4>
  * Books/Reading: <h4 class="text-lg font-semibold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Heading</h4>
  * Events/Meetings: <h4 class="text-lg font-semibold mb-2 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Heading</h4>
  * Statistics/Data: <h4 class="text-lg font-semibold mb-2 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Heading</h4>
  * Authors/People: <h4 class="text-lg font-semibold mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Heading</h4>
  * Moderators/Team: <h4 class="text-lg font-semibold mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Heading</h4>
- Use proper HTML formatting for structured information
- Format lists as HTML unordered lists: <ul class="list-disc pl-5 space-y-2"><li>Item</li></ul>
- Format numbered lists as HTML ordered lists: <ol class="list-decimal pl-5 space-y-2"><li>Item</li></ol>
- Use <strong> tags for emphasis on important information
- When listing books, format as: "<strong>Title</strong> by Author (Genre)"
- When listing events, format as: "<strong>Event Name</strong> - Date: [date], Time: [time], Location: [location]"
- Use paragraph breaks (<p class="mb-3"></p>) to separate different topics
- For statistics, use a clear format like: "<strong>Books read:</strong> 14"
- Use <div class="p-3 rounded-md border mb-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"> for highlighted information boxes
- Always ensure your HTML is properly closed and nested

# CRITICAL INSTRUCTIONS
- ONLY use the exact event data provided in the context prompt
- Be precise about dates, times, locations, and event types based ONLY on the data provided
- If you don't have specific information, acknowledge it briefly without being overly apologetic
- When you DO have information, state it confidently and directly

# BOOK INFORMATION HANDLING
- Pay careful attention to the "publisher" field in book data - this contains the name of the member who recommended the book
- When asked about who recommended a book, check the "publisher" field for each book in the provided data
- For questions about specific books, search through ALL provided book data
- Count how many times each author appears in the book list to identify authors we've read multiple times

# CONTEXTUAL RESPONSE GUIDELINES
- For general knowledge questions about literature, focus on answering directly
- Only mention the current book or upcoming events when directly relevant
- Tailor your response to match the context and intent of the user's question
- Use a conversational tone and avoid unnecessary formality in follow-up messages

# CONVERSATION FLOW GUIDELINES
- DO NOT introduce yourself in every message - only in the first message of a conversation
- Treat follow-up questions as part of an ongoing conversation
- Maintain context from previous messages
- Keep responses conversational and flowing naturally
- DO NOT sign off with formal closings in follow-up messages
- For short follow-up questions, provide concise answers

IMPORTANT: Be confident, direct, and concise. Use colorful gradient headings to organize your responses beautifully.
`

export async function POST(req: Request) {
  try {
    const { message, bookData, eventData, conversationHistory } = await req.json()

    // Extract key statistics for context
    const bookCount = bookData.allBooks?.length || 0
    const authors = [...new Set((bookData.allBooks || []).map((book: any) => book.author).filter(Boolean))]
    const genres = [...new Set((bookData.allBooks || []).map((book: any) => book.genre).filter(Boolean))]

    // Process event data with careful error handling
    let upcomingEvents: any[] = []
    let pastEvents: any[] = []
    let totalEventsCount = 0
    let upcomingEventsCount = 0
    let pastEventsCount = 0

    if (Array.isArray(eventData) && eventData.length > 0) {
      const currentDate = new Date()

      try {
        upcomingEvents = eventData
          .filter((event: any) => event && event.date && new Date(event.date) > currentDate)
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((event: any) => ({
            _id: event._id || "",
            title: event.title || "Untitled Event",
            date: event.date ? new Date(event.date).toLocaleDateString() : "Unknown date",
            time: event.time || "TBA",
            location: event.location || "TBA",
            type: event.type || "Event",
            description: event.description || "",
            moderators: Array.isArray(event.moderators) ? event.moderators : [],
            bookTitle: event.bookTitle || "",
            bookAuthor: event.bookAuthor || "",
          }))

        pastEvents = eventData
          .filter((event: any) => event && event.date && new Date(event.date) <= currentDate)
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((event: any) => ({
            _id: event._id || "",
            title: event.title || "Untitled Event",
            date: event.date ? new Date(event.date).toLocaleDateString() : "Unknown date",
            time: event.time || "TBA",
            location: event.location || "TBA",
            type: event.type || "Event",
            description: event.description || "",
            moderators: Array.isArray(event.moderators) ? event.moderators : [],
            bookTitle: event.bookTitle || "",
            bookAuthor: event.bookAuthor || "",
          }))

        upcomingEventsCount = upcomingEvents.length
        pastEventsCount = pastEvents.length
        totalEventsCount = upcomingEventsCount + pastEventsCount
      } catch (error) {
        console.error("Error processing event data:", error)
        upcomingEvents = []
        pastEvents = []
        upcomingEventsCount = 0
        pastEventsCount = 0
        totalEventsCount = eventData.length || 0
      }
    }

    // Process all books
    let allProcessedBooks = []
    if (Array.isArray(bookData.allBooks) && bookData.allBooks.length > 0) {
      try {
        allProcessedBooks = bookData.allBooks.map((book: any) => ({
          _id: book._id || "",
          title: book.title || "Untitled Book",
          author: book.author || "Unknown Author",
          genre: book.genre || "",
          publisher: book.publisher || "",
          description: book.description || "",
        }))
      } catch (error) {
        console.error("Error processing all book data:", error)
        allProcessedBooks = []
      }
    }

    // Count books by author
    const authorCounts: Record<string, number> = {}
    const booksByAuthor: Record<string, any[]> = {}

    allProcessedBooks.forEach((book: any) => {
      if (book.author) {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1
        if (!booksByAuthor[book.author]) {
          booksByAuthor[book.author] = []
        }
        booksByAuthor[book.author].push({
          title: book.title,
          genre: book.genre,
          publisher: book.publisher,
        })
      }
    })

    const multipleReadAuthors = Object.keys(authorCounts)
      .filter((author: string) => authorCounts[author] > 1)
      .map((author: string) => ({
        name: author,
        count: authorCounts[author],
        books: booksByAuthor[author],
      }))

    // Analyze the user's message
    const lowerMessage = message.toLowerCase()
    const isGeneralKnowledgeQuestion =
      (lowerMessage.includes("who is") ||
        lowerMessage.includes("what is") ||
        lowerMessage.includes("when") ||
        lowerMessage.includes("where") ||
        lowerMessage.includes("how") ||
        lowerMessage.includes("why") ||
        lowerMessage.includes("tell me about") ||
        lowerMessage.includes("age") ||
        lowerMessage.includes("born") ||
        lowerMessage.includes("author") ||
        lowerMessage.includes("book") ||
        lowerMessage.includes("novel")) &&
      !lowerMessage.includes("book club") &&
      !lowerMessage.includes("reading circle") &&
      !lowerMessage.includes("event") &&
      !lowerMessage.includes("meeting")

    const isAskingForRecommendation =
      lowerMessage.includes("recommend") ||
      lowerMessage.includes("suggest") ||
      lowerMessage.includes("what should") ||
      lowerMessage.includes("next book") ||
      lowerMessage.includes("next month") ||
      lowerMessage.includes("what to read")

    const isFollowUpQuestion = Array.isArray(conversationHistory) && conversationHistory.length > 0

    let formattedConversationHistory = ""
    if (isFollowUpQuestion && Array.isArray(conversationHistory)) {
      formattedConversationHistory = conversationHistory
        .map((exchange: any) => {
          if (exchange.role === "user") {
            return `User: ${exchange.content}`
          } else if (exchange.role === "assistant") {
            return `Gladwell: ${exchange.content}`
          }
          return ""
        })
        .filter(Boolean)
        .join("\n\n")
    }

    // Create context prompt
    const contextPrompt = `
# CURRENT READING CIRCLE DATA
- Current book of the month: ${
      bookData.currentBook?.title
        ? `"${bookData.currentBook.title}" by ${bookData.currentBook.author}`
        : "The Anxious Generation by Jonathan Haidt"
    }
- Total books read: ${bookCount || 14}
- Number of authors explored: ${authors.length}
- Number of genres explored: ${genres.length}
- Total events hosted: ${totalEventsCount || 4} (${upcomingEventsCount} upcoming, ${pastEventsCount} past)

# UPCOMING EVENTS (${upcomingEventsCount})
${
  upcomingEvents.length > 0
    ? upcomingEvents
        .map(
          (e: any) =>
            `- "${e.title}" on ${e.date} at ${e.time}, ${e.location}${e.type ? `, Type: ${e.type}` : ""}${
              e.moderators && e.moderators.length > 0 ? `, Moderated by: ${e.moderators.join(", ")}` : ""
            }${e.bookTitle ? `, Book: "${e.bookTitle}"${e.bookAuthor ? ` by ${e.bookAuthor}` : ""}` : ""}`,
        )
        .join("\n")
    : "- No upcoming events are currently scheduled."
}

# PAST EVENTS (${pastEventsCount})
${
  pastEvents.length > 0
    ? pastEvents
        .map(
          (e: any) =>
            `- "${e.title}" on ${e.date} at ${e.time}, ${e.location}${e.type ? `, Type: ${e.type}` : ""}${
              e.moderators && e.moderators.length > 0 ? `, Moderated by: ${e.moderators.join(", ")}` : ""
            }${e.bookTitle ? `, Book: "${e.bookTitle}"${e.bookAuthor ? ` by ${e.bookAuthor}` : ""}` : ""}`,
        )
        .join("\n")
    : "- No past events recorded yet."
}

# ALL BOOKS (${allProcessedBooks.length})
${
  allProcessedBooks.length > 0
    ? allProcessedBooks
        .map(
          (b: any) =>
            `- "${b.title}" by ${b.author}${b.genre ? ` (${b.genre})` : ""}${
              b.publisher ? `, Recommended by: ${b.publisher}` : ""
            }`,
        )
        .join("\n")
    : "- The Anxious Generation by Jonathan Haidt (Current book)"
}

# AUTHORS READ MULTIPLE TIMES (${multipleReadAuthors.length})
${
  multipleReadAuthors.length > 0
    ? multipleReadAuthors
        .map(
          (author: any) =>
            `- ${author.name} (${author.count} books): ${author.books
              .map((b: any) => `"${b.title}"${b.publisher ? ` recommended by ${b.publisher}` : ""}`)
              .join(", ")}`,
        )
        .join("\n")
    : "- No authors have been read multiple times yet."
}

${
  isFollowUpQuestion
    ? `# CONVERSATION HISTORY
${formattedConversationHistory}
`
    : ""
}

# QUERY ANALYSIS
- This is ${isGeneralKnowledgeQuestion ? "a general knowledge question about literature" : "a question about the book club"}
- ${isAskingForRecommendation ? "The user wants book recommendations - suggest both club books AND new suggestions" : ""}
- This is ${isFollowUpQuestion ? "a follow-up question" : "the first message"}

User message: ${message}

Remember: Be confident and direct. Use colorful gradient headings. ${
      isFollowUpQuestion ? "This is a follow-up, so skip introductions." : ""
    }
`

    // Generate AI response
    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: contextPrompt,
      system: SYSTEM_PROMPT,
      maxTokens: 500,
      temperature: 0.8,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error generating AI response:", error)
    return NextResponse.json({ error: "Failed to generate response", fallback: true }, { status: 500 })
  }
}
