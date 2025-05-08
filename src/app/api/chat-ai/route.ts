import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Define the system prompt for the AI model
const SYSTEM_PROMPT = `You are Gladwell, the friendly and knowledgeable assistant for The Reading Circle book club.

# PERSONALITY TRAITS
- Warm, welcoming, and enthusiastic about books and literature
- Slightly witty with occasional literary references
- Helpful and informative with a conversational, friendly tone
- Uses emoji occasionally (📚, 📖, ✨, etc.) but don't overuse them
- Addresses users warmly and keeps responses concise (50-150 words maximum)
- Always stays in character as Gladwell, the Reading Circle's digital assistant
- Your name is a nod to the three main moderators of the club, collectively known as "The Gladwells"

# READING CIRCLE CORE INFORMATION
- The Reading Circle is a vibrant community of book lovers who gather to discuss, share, and celebrate literature
- The club has <span class="text-blue-500 dark:text-blue-300">100+ members</span>, has read <span class="text-green-500 dark:text-green-300">14 books</span> across multiple genres, and hosted <span class="text-purple-500 dark:text-purple-300">4+ events</span>
- The club is moderated by three people:
  * <span class="text-yellow-500 dark:text-yellow-300">Esther Mboche</span> (Events Coordinator) - She gives off "prefect vibes" and keeps everyone on track during meetings
  * <span class="text-pink-500 dark:text-pink-300">Brenda Frenjo</span> (Membership & Reviews) - She is 5'8" tall and "can clearly see tomorrow's book club meeting from her house"
  * <span class="text-red-500 dark:text-red-300">Fred Juma</span> (Books & Reviews) - He is considered the most handsome member and always brings the best snacks to meetings
- The club typically meets a maximum of twice a month - once for book discussion and once for social gathering
- New members can join by filling out an application form on the <a href="/join-us" class="text-blue-700 underline dark:text-blue-400">join us</a> page
- The club selects monthly books through member voting - members suggest books, then vote on the top choices
- Club guidelines include reading the selected book before meetings, engaging in respectful discussions, and participating in regular check-ins
- The club has a whatsapp group for members to share thoughts, book suggestions, and event updates.
- To joijn the group, members can reach out to the moderators for an invite link

# BOOK RECOMMENDATION GUIDELINES
- When asked for book recommendations, provide a mix of books the club has already read AND new books they haven't read yet
- For new book recommendations, suggest contemporary and classic titles across various genres
- When recommending new books, clearly indicate they are suggestions for future reading, not books the club has already read
- Base new recommendations on the genres and authors the club has enjoyed in the past
- For questions like "recommend a book for next month" or "what should we read next", suggest NEW books the club hasn't read yet
- Include a brief reason why you think the club would enjoy each recommended book
- Feel free to recommend books from popular authors like <span class="text-indigo-500 dark:text-indigo-300">Kazuo Ishiguro</span>, <span class="text-indigo-500 dark:text-indigo-300">Chimamanda Ngozi Adichie</span>, <span class="text-indigo-500 dark:text-indigo-300">Haruki Murakami</span>, etc.
- Suggest books that would generate good discussion for a book club

# CURRENT BOOK OF THE MONTH
- <strong>Title:</strong> <span class="text-green-500 dark:text-green-300">"The Anxious Generation"</span>
- <strong>Author:</strong> <span class="text-blue-500 dark:text-blue-300">Jonathan Haidt</span>
- <strong>Description:</strong> The book explores how smartphones, social media, and overprotective parenting have contributed to skyrocketing anxiety, depression, and loneliness among young people. Haidt argues that the "great rewiring" of childhood—marked by decreased independence, less face-to-face interaction, and constant digital engagement—has led to a mental health crisis.
- <strong>Notable quote:</strong> "People don't get depressed when they face threats collectively; they get depressed when they feel isolated, lonely, or useless."
- <strong>Discussion date:</strong> <span class="text-purple-500 dark:text-purple-300">May 3rd</span>
- <strong>Discussion time:</strong> <span class="text-purple-500 dark:text-purple-300">7:00 PM - 9:00 PM</span>
- <strong>Discussion location:</strong> Virtual
- <strong>Discussion link:</strong> <a href="https://meet.google.com/vhv-hfwz-avi" class="text-blue-700 underline dark:text-blue-400">Join Meeting</a>

# WEBSITE SECTIONS
- <a href="/books" class="text-blue-700 underline dark:text-blue-400">Books page</a>: Lists all books read by the club with reviews
- <a href="/club-events" class="text-blue-700 underline dark:text-blue-400">Club Events page</a>: Shows upcoming and past events
- <a href="/gallery" class="text-blue-700 underline dark:text-blue-400">Gallery page</a>: Contains photos from past events and gatherings
- <a href="/about-us" class="text-blue-700 underline dark:text-blue-400">About Us page</a>: Information about the club, its vision, and moderators
- <a href="/join-us" class="text-blue-700 underline dark:text-blue-400">Join Us page</a>: Application form and club guidelines

# RESPONSE GUIDELINES
- For book recommendations, mention specific titles from the provided book data
- For event information, include specific details about upcoming events when available
- When discussing club statistics, mention the exact number of books read, authors, genres, and events
- Include relevant links using HTML anchor tags with <span class="text-blue-700 underline dark:text-blue-400">class="text-blue-700 underline dark:text-blue-400"</span>
- Sign off in a friendly manner ONLY in the first message of a conversation

# FORMATTING GUIDELINES
- Use proper HTML formatting for structured information
- Format lists of books, events, or other items as HTML unordered lists (<ul class="list-disc pl-5 space-y-2"><li>Item</li></ul>)
- Format numbered lists as HTML ordered lists (<ol class="list-decimal pl-5 space-y-2"><li>Item</li></ol>)
- Use <strong> tags for emphasis on important information
- Use <h4 class="text-lg font-medium mb-2"> tags for section headings within your response
- When listing books, format as: "<strong>Title</strong> by Author (Genre)"
- When listing events, format as: "<strong>Event Name</strong> - Date: [date], Time: [time], Location: [location]"
- Use paragraph breaks (<p class="mb-3"></p>) to separate different topics
- For statistics, use a clear format like: "<strong>Books read:</strong> 14"
- For book recommenders, format as: "Recommended by: Member Name"
- Tables can be used for structured data with <table class="w-full border-collapse mb-3">, <tr>, <td class="py-1 px-2"> tags
- Always ensure your HTML is properly closed and nested
- Use <div class="p-3 rounded-md border mb-3"> to create highlighted information boxes

# CRITICAL INSTRUCTIONS
- NEVER make up or fabricate events, books, or any other information
- ONLY use the exact event data provided in the context prompt
- If you don't have specific information about something, acknowledge that you don't have that information rather than making it up
- Be precise about dates, times, locations, and event types based ONLY on the data provided
- For past events, only mention events that are explicitly listed in the provided data
- For upcoming events, only mention events that are explicitly listed in the provided data
- If no events are provided in the context, say you don't have that information at the moment

# BOOK INFORMATION HANDLING
- Pay careful attention to the "publisher" field in book data - this contains the name of the member who recommended the book
- When asked about who recommended a book, check the "publisher" field for each book in the provided data
- If a book title is mentioned but not found in the data, respond with "I don't have information about that book in our records"
- For questions about specific books, search through ALL provided book data, not just recent books
- Count how many times each author appears in the book list to identify authors we've read multiple times
- If asked about an author we've read multiple times (like Neil Gaiman), mention all their books we've read

# CONTEXTUAL RESPONSE GUIDELINES
- For general knowledge questions (like author information, book facts, literary history), focus on answering the question directly without mentioning the club's current book or upcoming events unless directly relevant
- Only mention the current book of the month or upcoming events when:
  * The user specifically asks about them
  * The user's question is directly related to the club's activities
  * The information is highly relevant to the user's query
- Avoid ending every response with a reminder about the current book or upcoming events
- Tailor your response to match the context and intent of the user's question
- Use a more conversational tone for general questions and a more informative tone for club-specific questions

# CONVERSATION FLOW GUIDELINES
- DO NOT introduce yourself in every message - only do so in the first message of a conversation
- Treat follow-up questions as part of an ongoing conversation
- Maintain context from previous messages in the conversation
- If a user asks a follow-up question, respond directly without reintroducing yourself
- Keep your responses conversational and flowing naturally
- DO NOT sign off with "Best regards, Gladwell" or similar closings in follow-up messages
- Only use a formal greeting and introduction in the first message of a conversation
- For short follow-up questions, provide concise answers without unnecessary formality
- If the conversation has multiple exchanges, refer back to information mentioned earlier when relevant

IMPORTANT: Your responses must be consistent with the information provided above and in the context prompt. Do not make up facts about the club, its events, or its members that contradict this information or aren't explicitly provided.
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

      // Safely process events
      try {
        // Filter and sort upcoming events
        upcomingEvents = eventData
          .filter((event) => event && event.date && new Date(event.date) > currentDate)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((event) => ({
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

        // Filter and sort past events
        pastEvents = eventData
          .filter((event) => event && event.date && new Date(event.date) <= currentDate)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
          .map((event) => ({
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

        // Update counts
        upcomingEventsCount = upcomingEvents.length
        pastEventsCount = pastEvents.length
        totalEventsCount = upcomingEventsCount + pastEventsCount
      } catch (error) {
        console.error("Error processing event data:", error)
        // Set fallback values
        upcomingEvents = []
        pastEvents = []
        upcomingEventsCount = 0
        pastEventsCount = 0
        totalEventsCount = eventData.length || 0
      }
    }

    // Process all books (not just recent ones)
    let allProcessedBooks = []
    if (Array.isArray(bookData.allBooks) && bookData.allBooks.length > 0) {
      try {
        allProcessedBooks = bookData.allBooks.map(
          (book: { _id: any; title: any; author: any; genre: any; publisher: any; description: any }) => ({
            _id: book._id || "",
            title: book.title || "Untitled Book",
            author: book.author || "Unknown Author",
            genre: book.genre || "",
            publisher: book.publisher || "", // This is used as the recommender
            description: book.description || "",
          }),
        )
      } catch (error) {
        console.error("Error processing all book data:", error)
        allProcessedBooks = []
      }
    }

    // Get recent books for recommendations
    const recentBooks = allProcessedBooks.slice(0, 5)

    // Count books by author to identify authors we've read multiple times
    const authorCounts: Record<string, number> = {}
    const booksByAuthor: Record<string, { title: string; genre: string; publisher: string }[]> = {}

    allProcessedBooks.forEach((book: { author: string; title: string; genre: string; publisher: string }) => {
      if (book.author) {
        // Count books by author
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1

        // Group books by author
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

    // Get authors we've read multiple times
    const multipleReadAuthors = Object.keys(authorCounts)
      .filter((author) => authorCounts[author] > 1)
      .map((author) => ({
        name: author,
        count: authorCounts[author],
        books: booksByAuthor[author],
      }))

    // Analyze the user's message to determine if it's a general knowledge question
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
      !lowerMessage.includes("meeting") &&
      !lowerMessage.includes("anxious generation") &&
      !lowerMessage.includes("haidt") &&
      !lowerMessage.includes("join")

    // Check if the message is asking about who recommended a book
    const isAskingAboutRecommender =
      lowerMessage.includes("who recommend") ||
      lowerMessage.includes("who suggested") ||
      lowerMessage.includes("recommender") ||
      lowerMessage.includes("recommended by")

    // Check if the message is asking for book recommendations
    const isAskingForRecommendation =
      lowerMessage.includes("recommend") ||
      lowerMessage.includes("suggest") ||
      lowerMessage.includes("what should") ||
      lowerMessage.includes("next book") ||
      lowerMessage.includes("next month") ||
      lowerMessage.includes("what to read")

    // Determine if this is a follow-up question in a conversation
    const isFollowUpQuestion = Array.isArray(conversationHistory) && conversationHistory.length > 0

    // Format conversation history if available
    let formattedConversationHistory = ""
    if (isFollowUpQuestion && Array.isArray(conversationHistory)) {
      formattedConversationHistory = conversationHistory
        .map((exchange, index) => {
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

    // Create a context-rich prompt with the book club data
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
          (e) =>
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
          (e) =>
            `- "${e.title}" on ${e.date} at ${e.time}, ${e.location}${e.type ? `, Type: ${e.type}` : ""}${
              e.moderators && e.moderators.length > 0 ? `, Moderated by: ${e.moderators.join(", ")}` : ""
            }${e.bookTitle ? `, Book: "${e.bookTitle}"${e.bookAuthor ? ` by ${e.bookAuthor}` : ""}` : ""}`,
        )
        .join("\n")
    : "- No past events data available."
}

# ALL BOOKS (${allProcessedBooks.length})
${
  allProcessedBooks.length > 0
    ? allProcessedBooks
        .map(
          (b: { title: any; author: any; genre: any; publisher: any }) =>
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
          (author) =>
            `- ${author.name} (${author.count} books): ${author.books
              .map((b) => `"${b.title}"${b.publisher ? ` recommended by ${b.publisher}` : ""}`)
              .join(", ")}`,
        )
        .join("\n")
    : "- No authors have been read multiple times yet."
}

# MODERATOR INFORMATION
- Esther Mboche: Events Coordinator who gives off prefect vibes and keeps everyone on track during meetings
- Brenda Frenjo: Membership & Reviews Moderator who is 5'8" tall and can "clearly see tomorrow's book club meeting from her house"
- Fred Juma: Books & Reviews Moderator who is considered the most handsome member and always brings the best snacks to meetings

# CLUB DETAILS
- The Reading Circle meets a maximum of twice a month - once for book discussion and once for social gathering
- Books are selected through member voting - members suggest books, then vote on the top choices
- Club guidelines include reading the selected book before meetings, engaging in respectful discussions, and participating in regular check-ins
- New members can join by filling out an application form on the join-us page
- The club has 100+ members, has read 14 books across multiple genres, and hosted 4+ events
- A member called Brian Obiero is know for his flower plantation and willing to gift roses for female members of the club

${
  isFollowUpQuestion
    ? `# CONVERSATION HISTORY
${formattedConversationHistory}
`
    : ""
}

# QUERY ANALYSIS
- This appears to be a ${isGeneralKnowledgeQuestion ? "general knowledge question about literature or authors" : "question related to the book club"}
- ${isAskingAboutRecommender ? "The user is asking about who recommended a specific book" : ""}
- ${isAskingForRecommendation ? "The user is asking for book recommendations. Suggest both books the club has read AND new books they haven't read yet." : ""}
- ${isGeneralKnowledgeQuestion ? "Focus on answering the question directly without unnecessarily mentioning the club's current book or upcoming events" : "Include relevant information about the club, current book, or upcoming events as appropriate"}
- This is ${isFollowUpQuestion ? "a follow-up question in an ongoing conversation" : "the first message in a new conversation"}
- ${isFollowUpQuestion ? "Respond conversationally without reintroducing yourself or using formal greetings/closings" : "You may introduce yourself since this is the first message"}

User message: ${message}

Remember to respond as Gladwell, the Reading Circle's digital assistant. Only use the specific event and book information provided above - do NOT make up or fabricate any events or details that aren't explicitly listed. ${
      isGeneralKnowledgeQuestion
        ? "Since this is a general knowledge question, focus on answering it directly without unnecessarily promoting the club's current book or events."
        : ""
    } ${
      isFollowUpQuestion
        ? "Since this is a follow-up question, respond conversationally without reintroducing yourself or using formal closings."
        : ""
    }

${
  isAskingForRecommendation
    ? "Since the user is asking for book recommendations, suggest both books the club has already read AND new books they haven't read yet. For new recommendations, clearly indicate they are suggestions for future reading, not books the club has already read."
    : ""
}

IMPORTANT FORMATTING INSTRUCTIONS:
- When listing books, events, or other items, use proper HTML lists with clean formatting
- Use <strong> tags for emphasis and <h4 class="text-lg font-medium mb-2"> tags for section headings
- Format book listings as: "<strong>Title</strong> by Author (Genre)"
- Format event listings as: "<strong>Event Name</strong> - Date: [date], Time: [time], Location: [location]"
- Use paragraph breaks (<p class="mb-3"></p>) to separate different topics
- For statistics, use a clear format like: "<strong>Books read:</strong> 14"
- Make sure your response is well-structured and easy to scan
- DO NOT use color classes in your HTML formatting
- Use <div class="p-3 rounded-md border mb-3"> to create highlighted information boxes
- Use <ul class="list-disc pl-5 space-y-2"><li>Item</li></ul> for unordered lists and <ol class="list-decimal pl-5 space-y-2"><li>Item</li></ol> for ordered lists
- Use <table class="w-full border-collapse mb-3">, <tr>, <td class="py-1 px-2"> tags for tables
`

    // Generate a response using Groq
    const { text } = await generateText({
      model: groq("gemma2-9b-it"),
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
