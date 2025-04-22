"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, BookOpen, ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Import the member profiles and insights
import { memberProfiles } from "@/lib/member-profiles"

// Define types for the data
interface EventData {
  [x: string]: any
  _id: string
  title: string
  date: string
  time: string
  location: string
  description?: string
  image?: string
  type?: string
}

interface BookData {
  _id: string
  title: string
  author: string
  coverImage?: string
  description?: string
  genre?: string
  _createdDate?: string
  publisher?: string // Used for storing who recommended the book
}

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

// Define conversation history type for AI context
type ConversationExchange = {
  role: "user" | "assistant"
  content: string
}

type ChatBotProps = {
  initialEvents?: EventData[]
  initialBook?: BookData | null
  allBooks?: BookData[]
}

export default function ChatBot({ initialEvents = [], initialBook = null, allBooks = [] }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hi there! I'm Gladwell, the Reading Circle Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [useAI, setUseAI] = useState(true)

  // Track conversation history for context
  const [conversationHistory, setConversationHistory] = useState<ConversationExchange[]>([])

  // Extract book club statistics
  const bookCount = allBooks?.length || 0
  const authors = [...new Set((allBooks || []).map((book) => book.author).filter(Boolean))]
  const genres = [...new Set((allBooks || []).map((book) => book.genre).filter(Boolean))]
  const upcomingEventsCount = (initialEvents || []).filter((event) => new Date(event.date) > new Date()).length
  const pastEventsCount = (initialEvents || []).length - upcomingEventsCount
  const totalEventsCount = (initialEvents || []).length

  // Count books by author to identify authors we've read multiple times
  const authorCounts: Record<string, number> = {}
  const booksByAuthor: Record<string, { title: string; genre?: string; publisher?: string }[]> = {}

  if (allBooks && allBooks.length > 0) {
    allBooks.forEach((book) => {
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
  }

  // Get authors we've read multiple times
  const multipleReadAuthors = Object.keys(authorCounts)
    .filter((author) => authorCounts[author] > 1)
    .map((author) => ({
      name: author,
      count: authorCounts[author],
      books: booksByAuthor[author],
    }))

  // Sample suggestions
  const suggestions = [
    "Tell me about the club",
    "Book of the month?",
    "Next event?",
    "Club statistics",
    "Tell me about members",
    "How to join?",
    "What are the guidelines?",
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Update conversation history when messages change
  useEffect(() => {
    if (messages.length > 1) {
      // Skip the welcome message
      const newHistory: ConversationExchange[] = []

      // Start from index 1 to skip welcome message
      for (let i = 1; i < messages.length; i++) {
        const message = messages[i]
        newHistory.push({
          role: message.sender === "user" ? "user" : "assistant",
          content: message.content,
        })
      }

      setConversationHistory(newHistory)
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      if (useAI) {
        // Try to use AI API first
        const response = await fetch("/api/chat-ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputValue,
            bookData: {
              currentBook: initialBook,
              allBooks: allBooks,
            },
            eventData: initialEvents,
            conversationHistory: conversationHistory, // Pass conversation history for context
          }),
        })

        const data = await response.json()

        if (response.ok && !data.fallback) {
          // AI response successful
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: data.response,
              sender: "bot",
              timestamp: new Date(),
            },
          ])
          setIsTyping(false)
          return
        }
      }

      // Fallback to rule-based responses if AI fails or is disabled
      setTimeout(() => {
        const botResponse = generateResponse(inputValue)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: botResponse,
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Fallback to rule-based responses
      setTimeout(() => {
        const botResponse = generateResponse(inputValue)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: botResponse,
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSend()
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    // Ensure messages scroll to bottom after resize
    setTimeout(scrollToBottom, 300)
  }

  // Fallback response generator (used when AI is unavailable)
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim()

    // Small talk responses
    if (
      lowerQuery === "hello" ||
      lowerQuery === "hi" ||
      lowerQuery === "hey" ||
      lowerQuery === "hello!" ||
      lowerQuery === "hi there" ||
      lowerQuery.includes("hello gladwell")
    ) {
      return `👋 Hello there! I'm Gladwell, your friendly book club assistant. How can I help you with The Reading Circle today?`
    }

    if (
      lowerQuery.includes("how are you") ||
      lowerQuery.includes("how's it going") ||
      lowerQuery.includes("how are things")
    ) {
      return `I'm doing great, thanks for asking! As Gladwell, I'm always excited to talk about books and our reading club. How can I assist you today?`
    }

    if (
      lowerQuery.includes("who are you") ||
      lowerQuery.includes("what are you") ||
      lowerQuery.includes("your name") ||
      lowerQuery.includes("gladwell")
    ) {
      return `I'm Gladwell, the Reading Circle's digital assistant! My name is a little nod to the three main moderators of the club The Gladwells. I'm here to help you with information about our events, current book selections, and how to join our community of book lovers!`
    }

    // Book club statistics
    if (
      lowerQuery.includes("statistics") ||
      lowerQuery.includes("stats") ||
      lowerQuery.includes("numbers") ||
      lowerQuery.includes("how many")
    ) {
      if (lowerQuery.includes("book") || lowerQuery.includes("read")) {
        return `<h4 class="text-lg font-medium mb-2">📚 Gladwell's Book Statistics</h4>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Total books read:</strong> ${bookCount}</li>
  <li><strong>Authors explored:</strong> ${authors.length}</li>
  <li><strong>Genres covered:</strong> ${genres.length}</li>
</ul>
<p class="mb-3">Our members are always excited to discover new literary worlds together!</p>`
      }

      if (lowerQuery.includes("event") || lowerQuery.includes("meeting")) {
        return `<h4 class="text-lg font-medium mb-2">📅 Gladwell's Event Statistics</h4>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Total events:</strong> ${totalEventsCount}</li>
  <li><strong>Upcoming events:</strong> ${upcomingEventsCount}</li>
  <li><strong>Past gatherings:</strong> ${pastEventsCount}</li>
</ul>
<p class="mb-3">Our events include book discussions, author talks, and social gatherings.</p>`
      }

      // General statistics
      return `<h4 class="text-lg font-medium mb-2">📊 Gladwell's Club Statistics</h4>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Books read:</strong> ${bookCount} books from ${authors.length} authors across ${genres.length} genres</li>
  <li><strong>Events hosted:</strong> ${totalEventsCount} events (${pastEventsCount} past, ${upcomingEventsCount} upcoming)</li>
  <li><strong>Community size:</strong> 100+ passionate readers</li>
</ul>
<p class="mb-3">Our community is growing with passionate readers who love to share their literary journeys!</p>`
    }

    // Authors information
    if (
      lowerQuery.includes("author") ||
      lowerQuery.includes("writer") ||
      lowerQuery.includes("who wrote") ||
      lowerQuery.includes("who has written")
    ) {
      const authorsList = authors.slice(0, 5)
      const formattedAuthors = authorsList.map((author) => `<li>${author}</li>`).join("")

      return `<h4 class="text-lg font-medium mb-2">✍️ Gladwell's Author Insights</h4>
<p class="mb-3">The Reading Circle has explored works from ${authors.length} different authors, including:</p>
<ul class="list-disc pl-5 space-y-2">
  ${formattedAuthors}
  ${authors.length > 5 ? "<li>...and more!</li>" : ""}
</ul>
<p class="mb-3">We love discovering diverse voices and perspectives through our reading selections!</p>`
    }

    // Authors we've read multiple times
    if (
      lowerQuery.includes("multiple") ||
      lowerQuery.includes("twice") ||
      lowerQuery.includes("more than once") ||
      (lowerQuery.includes("neil") && lowerQuery.includes("gaiman"))
    ) {
      let authorContent = ""

      if (multipleReadAuthors.length > 0) {
        const authorItems = multipleReadAuthors
          .map((author) => {
            const bookList = author.books
              .map(
                (book) =>
                  `<li><strong>${book.title}</strong>${book.publisher ? ` (Recommended by: ${book.publisher})` : ""}</li>`,
              )
              .join("")

            return `<div class="mb-3">
  <p class="font-medium">${author.name} (${author.count} books):</p>
  <ul class="list-disc pl-5 space-y-2">
    ${bookList}
  </ul>
</div>`
          })
          .join("")

        authorContent = `<div class="p-3 rounded-md border mb-3">
  ${authorItems}
</div>`
      } else {
        authorContent = `<p class="mb-3">We haven't read any authors multiple times yet.</p>`
      }

      return `<h4 class="text-lg font-medium mb-2">📚 Authors We've Read Multiple Times</h4>
${authorContent}`
    }

    // Genres information
    if (lowerQuery.includes("genre") || lowerQuery.includes("type of book") || lowerQuery.includes("category")) {
      const genresList = genres.slice(0, 5)
      const formattedGenres = genresList.map((genre) => `<li>${genre}</li>`).join("")

      return `<h4 class="text-lg font-medium mb-2">📚 Gladwell's Genre Guide</h4>
<p class="mb-3">The Reading Circle has explored ${genres.length} different genres, including:</p>
<ul class="list-disc pl-5 space-y-2">
  ${formattedGenres}
  ${genres.length > 5 ? "<li>...and more!</li>" : ""}
</ul>
<p class="mb-3">We enjoy diversifying our reading experiences across different literary categories!</p>`
    }

    // Book count
    if (
      lowerQuery.includes("how many books") ||
      lowerQuery.includes("book count") ||
      lowerQuery.includes("number of books")
    ) {
      return `<h4 class="text-lg font-medium mb-2">📚 Gladwell's Book Count</h4>
<p class="mb-3">The Reading Circle has read <strong>${bookCount} books</strong> so far! Our members are always excited to add more great titles to this growing list.</p>`
    }

    // Events information
    if (
      lowerQuery.includes("what is the reading circle") ||
      lowerQuery.includes("what's the reading circle") ||
      lowerQuery.includes("who are we") ||
      lowerQuery.includes("about the club") ||
      lowerQuery.includes("tell me about the club")
    ) {
      return `<div class="p-3 rounded-md border mb-3">
  <h4 class="text-lg font-medium mb-2">About The Reading Circle</h4>
  <p class="mb-3">The Reading Circle is a vibrant community of book lovers who gather to discuss, share, and celebrate our love for literature. We've read ${bookCount} books across ${genres.length} genres and hosted ${totalEventsCount} events.</p>
  <p class="mb-3">Our club is moderated by:</p>
  <ul class="list-disc pl-5 space-y-2">
    <li><strong>Esther Mboche</strong> - Events Coordinator</li>
    <li><strong>Brenda Frenjo</strong> - Membership & Reviews</li>
    <li><strong>Fred Juma</strong> - Books & Reviews</li>
  </ul>
  <p class="mb-3">We aim to create a welcoming and inclusive environment where everyone feels valued and inspired to explore new genres and authors.</p>
</div>`
    }

    if (lowerQuery.includes("thank you") || lowerQuery.includes("thanks") || lowerQuery === "ty") {
      return `You're welcome! Gladwell is happy to help. Is there anything else you'd like to know about The Reading Circle?`
    }

    if (lowerQuery.includes("bye") || lowerQuery.includes("goodbye") || lowerQuery === "see you") {
      return `Goodbye! Gladwell will be here whenever you have more questions. Happy reading! 📚`
    }

    // Next event
    if (lowerQuery.includes("next event") || lowerQuery.includes("upcoming event")) {
      if (initialEvents && initialEvents.length > 0) {
        const nextEvent = initialEvents[0]
        return `<h4 class="text-lg font-medium mb-2">📅 Gladwell's Event Details</h4>
<p class="mb-3">Our next event is:</p>
<ul class="list-disc pl-5 space-y-2">
  <li>
    <strong>${nextEvent.title}</strong>
    <ul class="list-disc pl-5 space-y-1 mt-1">
      <li>Date: ${new Date(nextEvent.date).toLocaleDateString()}</li>
      <li>Time: ${nextEvent.time}</li>
      <li>Location: ${nextEvent.location}</li>
      ${nextEvent.type ? `<li>Type: ${nextEvent.type}</li>` : ""}
      ${nextEvent.bookTitle ? `<li>Book: "${nextEvent.bookTitle}" by ${nextEvent.bookAuthor || "Unknown"}</li>` : ""}
    </ul>
  </li>
</ul>
<p class="mb-3">You can find more details on our <a href="/club-events" class="underline">events page</a>.</p>`
      }
      return `<h4 class="text-lg font-medium mb-2">📅 Gladwell's Event Update</h4>
<p class="mb-3">You can find our upcoming events on the <a href="/club-events" class="underline">events page</a>. We regularly host book discussions, author talks, and social gatherings.</p>`
    }

    // Current book
    if (
      lowerQuery.includes("book of the month") ||
      lowerQuery.includes("current book") ||
      lowerQuery.includes("reading now") ||
      lowerQuery.includes("what are we reading")
    ) {
      if (initialBook) {
        return `<h4 class="text-lg font-medium mb-2">📚 Gladwell's Book Update</h4>
<p class="mb-3">We're currently reading:</p>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>${initialBook.title}</strong> by ${initialBook.author}${initialBook.genre ? ` (${initialBook.genre})` : ""}</li>
</ul>
<p class="mb-3">Join us for the discussion on our next meeting!</p>`
      }
      return `<h4 class="text-lg font-medium mb-2">📚 Gladwell's Book Update</h4>
<p class="mb-3">You can find our current book selection on the <a href="/books" class="underline">books page</a>. We select a new book each month through member voting.</p>`
    }

    // Book recommender
    if (
      lowerQuery.includes("who recommend") ||
      lowerQuery.includes("who suggested") ||
      lowerQuery.includes("recommender") ||
      lowerQuery.includes("recommended by")
    ) {
      // Extract book title from query
      let bookTitle = ""
      const words = lowerQuery.split(" ")

      for (let i = 0; i < words.length; i++) {
        if (
          words[i] === "recommend" ||
          words[i] === "recommended" ||
          words[i] === "suggests" ||
          words[i] === "suggested"
        ) {
          // Look for book title after these words
          if (i + 1 < words.length) {
            bookTitle = words.slice(i + 1).join(" ")
            break
          }
        }
      }

      // If no title found after recommend words, look for it before
      if (!bookTitle) {
        for (let i = 0; i < words.length; i++) {
          if (
            words[i] === "recommend" ||
            words[i] === "recommended" ||
            words[i] === "suggests" ||
            words[i] === "suggested"
          ) {
            // Look for book title before these words
            if (i > 0) {
              bookTitle = words.slice(0, i).join(" ")
              break
            }
          }
        }
      }

      // Clean up the title
      bookTitle = bookTitle.replace(/^who|^did|^who did|^the book/, "").trim()

      // Search for the book in allBooks
      const matchingBook = allBooks.find(
        (book) => book.title.toLowerCase().includes(bookTitle) || bookTitle.includes(book.title.toLowerCase()),
      )

      if (matchingBook && matchingBook.publisher) {
        return `<div class="p-3 rounded-md border mb-3">
  <h4 class="text-lg font-medium mb-2">📚 Book Recommendation Info</h4>
  <p class="mb-3"><strong>${matchingBook.title}</strong> by ${matchingBook.author} was recommended by <strong>${matchingBook.publisher}</strong>.</p>
</div>`
      } else if (matchingBook) {
        return `<div class="p-3 rounded-md border mb-3">
  <h4 class="text-lg font-medium mb-2">📚 Book Recommendation Info</h4>
  <p class="mb-3">I don't have information about who recommended <strong>${matchingBook.title}</strong> by ${matchingBook.author}.</p>
</div>`
      } else {
        return `<div class="p-3 rounded-md border mb-3">
  <h4 class="text-lg font-medium mb-2">📚 Book Recommendation Info</h4>
  <p class="mb-3">I don't have information about that book in our records. Would you like to know about other books we've read?</p>
</div>`
      }
    }

    // All books
    if (
      lowerQuery.includes("all books") ||
      lowerQuery.includes("book list") ||
      lowerQuery.includes("reading list") ||
      lowerQuery.includes("what have we read")
    ) {
      const recentBooksArray = allBooks.slice(0, 5)
      const formattedBooks = recentBooksArray
        .map(
          (book) =>
            `<li><strong>${book.title}</strong> by ${book.author}${book.genre ? ` (${book.genre})` : ""}${book.publisher ? ` - Recommended by: ${book.publisher}` : ""}</li>`,
        )
        .join("")

      return `<h4 class="text-lg font-medium mb-2">📚 Gladwell's Reading List</h4>
<p class="mb-3">The Reading Circle has read ${bookCount} books so far! Some of our recent selections include:</p>
<ul class="list-disc pl-5 space-y-2">
  ${formattedBooks}
</ul>
<p class="mb-3">You can view our complete reading history on the <a href="/books" class="underline">books page</a>.</p>`
    }

    // Moderators
    if (lowerQuery.includes("moderator") || lowerQuery.includes("leader") || lowerQuery.includes("who runs")) {
      return `<h4 class="text-lg font-medium mb-2">👥 Gladwell's Moderator Info</h4>
<p class="mb-3">Our club is moderated by:</p>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>Esther Mboche</strong> - Events Coordinator</li>
  <li><strong>Brenda Frenjo</strong> - Membership & Reviews</li>
  <li><strong>Fred Juma</strong> - Books & Reviews</li>
</ul>
<p class="mb-3">You can learn more about them on our <a href="/about-us" class="underline">about us page</a>.</p>`
    }

    // How to join
    if (lowerQuery.includes("join") || lowerQuery.includes("become member") || lowerQuery.includes("sign up")) {
      return `<div class="p-3 rounded-md border mb-3">
  <h4 class="text-lg font-medium mb-2">🎉 Join The Reading Circle</h4>
  <p class="mb-3">We'd love to have you join! Please fill out our application form on the <a href="/join-us" class="underline">join us page</a>.</p>
  <p class="mb-3">We'll ask about your reading habits and interests to help integrate you into our community.</p>
</div>`
    }

    // Meeting schedule
    if (lowerQuery.includes("schedule") || lowerQuery.includes("when") || lowerQuery.includes("meeting time")) {
      return `<h4 class="text-lg font-medium mb-2">🕒 Gladwell's Schedule Update</h4>
<p class="mb-3">We typically meet a maximum of twice a month:</p>
<ul class="list-disc pl-5 space-y-2">
  <li>Once for a book discussion</li>
  <li>Once for a social gathering or special event</li>
</ul>
<p class="mb-3">We've hosted ${totalEventsCount} events so far! Check our <a href="/club-events" class="underline">events calendar</a> for specific dates and times.</p>`
    }

    // Guidelines
    if (lowerQuery.includes("guideline") || lowerQuery.includes("rule") || lowerQuery.includes("expectation")) {
      return `<h4 class="text-lg font-medium mb-2">📝 Gladwell's Club Guidelines</h4>
<p class="mb-3">Our club guidelines include:</p>
<ul class="list-disc pl-5 space-y-2">
  <li>Reading the selected book before meetings</li>
  <li>Engaging in respectful discussions</li>
  <li>Participating in regular check-ins</li>
</ul>
<p class="mb-3">You can read the full guidelines on our <a href="/join-us?tab=guidelines" class="underline">join us page</a>.</p>`
    }

    // Handsome member
    if (
      lowerQuery.includes("handsome") ||
      lowerQuery.includes("who is handsome") ||
      lowerQuery.includes("most handsome")
    ) {
      return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3">The most handsome member of the club is <strong>Fred Juma</strong>. He is the one who always brings the best snacks to our meetings!</p>
</div>`
    }

    // fact about Brenda's height
    if (lowerQuery.includes("brenda") || lowerQuery.includes("height") || lowerQuery.includes("how tall is brenda")) {
      return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3"><strong>Brenda Frenjo</strong> is 5'8" tall. She can clearly see tomorrow's book club meeting from her house!</p>
</div>`
    }

    // fact about Esther's prefect vibes
    if (
      lowerQuery.includes("esther") ||
      lowerQuery.includes("vibes") ||
      lowerQuery.includes("how are esther's vibes")
    ) {
      return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3"><strong>Esther Mboche</strong> gives off prefect vibes. She is the one who always keeps us on track during our meetings! Don't be surprised if she gives you a warning for talking too much!</p>
</div>`
    }

    // book voting and selection
    if (
      lowerQuery.includes("book voting") ||
      lowerQuery.includes("how do we select books") ||
      lowerQuery.includes("book selection process")
    ) {
      return `<h4 class="text-lg font-medium mb-2">📖 Gladwell's Book Selection Process</h4>
<p class="mb-3">We select our monthly book through member voting!</p>
<ol class="list-decimal pl-5 space-y-2">
  <li>Each month, members can suggest books</li>
  <li>We vote on the top choices</li>
  <li>The book with the most votes becomes our book of the month</li>
</ol>
<p class="mb-3">It's a fun way to ensure everyone has a say in our reading list.</p>`
    }

    // Gallery
    if (
      lowerQuery.includes("photo") ||
      lowerQuery.includes("picture") ||
      lowerQuery.includes("image") ||
      lowerQuery.includes("gallery")
    ) {
      return `<h4 class="text-lg font-medium mb-2">📸 Gladwell's Gallery Guide</h4>
<p class="mb-3">You can view photos from our past events and gatherings in our <a href="/gallery" class="underline">gallery page</a>. We love capturing memories from our book discussions and social events!</p>`
    }

    // Book recommendations
    if (
      lowerQuery.includes("recommend") ||
      lowerQuery.includes("suggestion") ||
      lowerQuery.includes("what should i read")
    ) {
      // Get random books from different genres for recommendations
      const randomBooks = allBooks
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(
          (book) => `<li><strong>${book.title}</strong> by ${book.author}${book.genre ? ` (${book.genre})` : ""}</li>`,
        )
        .join("")

      return `<h4 class="text-lg font-medium mb-2">📚 Gladwell's Recommendations</h4>
<p class="mb-3">Based on our club's favorites, you might enjoy:</p>
<ul class="list-disc pl-5 space-y-2">
  ${randomBooks}
</ul>
<p class="mb-3">We've read ${bookCount} books across ${genres.length} genres so far! What genres do you typically enjoy?</p>`
    }

    // Member information
    if (
      lowerQuery.includes("member") ||
      lowerQuery.includes("who is in") ||
      lowerQuery.includes("who's in") ||
      lowerQuery.includes("who are the members") ||
      lowerQuery.includes("tell me about the members")
    ) {
      // Get a subset of members to display
      const highlightedMembers = memberProfiles.slice(0, 5)
      const formattedMembers = highlightedMembers
        .map(
          (member) =>
            `<li><strong>${member.name}</strong>${member.role ? ` (${member.role})` : ""}: ${
              member.participationStyle || "Active member"
            }${
              member.bookPreferences && member.bookPreferences.length > 0
                ? `, enjoys ${member.bookPreferences.join(", ")}`
                : ""
            }</li>`,
        )
        .join("")

      return `<h4 class="text-lg font-medium mb-2">👥 Gladwell's Member Insights</h4>
<p class="mb-3">The Reading Circle has a diverse community of book lovers! Here are some of our members:</p>
<ul class="list-disc pl-5 space-y-2">
  ${formattedMembers}
  ${memberProfiles.length > 5 ? "<li>...and many more wonderful readers!</li>" : ""}
</ul>
<p class="mb-3">Our members have diverse reading preferences including fiction, non-fiction, poetry, philosophy, science fiction, and more.</p>`
    }

    // Reading preferences by genre
    if (
      (lowerQuery.includes("who likes") ||
        lowerQuery.includes("who enjoys") ||
        lowerQuery.includes("who reads") ||
        lowerQuery.includes("who prefers")) &&
      (lowerQuery.includes("fiction") ||
        lowerQuery.includes("non-fiction") ||
        lowerQuery.includes("poetry") ||
        lowerQuery.includes("science") ||
        lowerQuery.includes("history") ||
        lowerQuery.includes("philosophy") ||
        lowerQuery.includes("business") ||
        lowerQuery.includes("romance"))
    ) {
      // Extract the genre from the query
      let genre = ""
      if (lowerQuery.includes("fiction") && !lowerQuery.includes("non-fiction")) genre = "fiction"
      else if (lowerQuery.includes("non-fiction")) genre = "non-fiction"
      else if (lowerQuery.includes("poetry")) genre = "poetry"
      else if (lowerQuery.includes("science")) genre = "science"
      else if (lowerQuery.includes("history")) genre = "history"
      else if (lowerQuery.includes("philosophy")) genre = "philosophy"
      else if (lowerQuery.includes("business")) genre = "business"
      else if (lowerQuery.includes("romance")) genre = "romance"

      // Find members who like this genre
      const matchingMembers = memberProfiles.filter(
        (member) =>
          member.bookPreferences &&
          member.bookPreferences.some((pref) => pref.toLowerCase().includes(genre.toLowerCase())),
      )

      if (matchingMembers.length > 0) {
        const formattedMembers = matchingMembers
          .map((member) => `<li><strong>${member.name}</strong>: ${member.participationStyle || "Active member"}</li>`)
          .join("")

        return `<div class="p-3 rounded-md border mb-3">
  <h4 class="text-lg font-medium mb-2">📚 Members Who Enjoy ${genre.charAt(0).toUpperCase() + genre.slice(1)}</h4>
  <ul class="list-disc pl-5 space-y-2">
    ${formattedMembers}
  </ul>
</div>`
      } else {
        return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3">I don't have specific information about members who enjoy ${genre} in our records. Would you like to know about other reading preferences in our club?</p>
</div>`
      }
    }

    // Specific member information
    const memberNames = memberProfiles.flatMap((member) => [
      member.name.toLowerCase(),
      ...(member.alternateNames || []).map((name) => name.toLowerCase()),
    ])

    if (memberNames.some((name) => lowerQuery.includes(name.toLowerCase()))) {
      // Find which member is being asked about
      let targetMember = null
      for (const member of memberProfiles) {
        if (lowerQuery.includes(member.name.toLowerCase())) {
          targetMember = member
          break
        }

        if (member.alternateNames) {
          const foundAlias = member.alternateNames.find((alias) => lowerQuery.includes(alias.toLowerCase()))
          if (foundAlias) {
            targetMember = member
            break
          }
        }
      }

      if (targetMember) {
        return `<div class="p-3 rounded-md border mb-3">
  <h4 class="text-lg font-medium mb-2">Member Profile: ${targetMember.name}</h4>
  <ul class="list-disc pl-5 space-y-2">
    ${targetMember.role ? `<li><strong>Role:</strong> ${targetMember.role}</li>` : ""}
    ${
      targetMember.bookPreferences && targetMember.bookPreferences.length > 0
        ? `<li><strong>Reading preferences:</strong> ${targetMember.bookPreferences.join(", ")}</li>`
        : ""
    }
    ${
      targetMember.participationStyle
        ? `<li><strong>Participation style:</strong> ${targetMember.participationStyle}</li>`
        : ""
    }
    ${
      targetMember.personalInterests && targetMember.personalInterests.length > 0
        ? `<li><strong>Personal interests:</strong> ${targetMember.personalInterests.join(", ")}</li>`
        : ""
    }
    ${
      targetMember.notableContributions && targetMember.notableContributions.length > 0
        ? `<li><strong>Notable contributions:</strong> ${targetMember.notableContributions.join(", ")}</li>`
        : ""
    }
    ${
      targetMember.notableQuotes && targetMember.notableQuotes.length > 0
        ? `<li><strong>Notable quotes:</strong> "${targetMember.notableQuotes.join('", "')}"</li>`
        : ""
    }
  </ul>
</div>`
      }
    }

    // Fallback response
    return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3">This is Gladwell! I'm not sure about that, but I can tell you that The Reading Circle has read ${bookCount} books and hosted ${totalEventsCount} events so far!</p>
  <p class="mb-3">Would you like to know about our:</p>
  <ul class="list-disc pl-5 space-y-2">
    <li><a href="/club-events" class="underline">Upcoming events</a></li>
    <li><a href="/books" class="underline">Current book</a></li>
    <li><a href="/join-us" class="underline">How to join</a></li>
    <li>Our members and their reading preferences</li>
  </ul>
</div>`
  }

  // Calculate dynamic sizes based on expanded state
  const chatWindowWidth = isExpanded ? "w-[90vw] sm:w-[500px] md:w-[600px] lg:w-[700px]" : "w-80 sm:w-96"
  const chatWindowHeight = isExpanded ? "h-[80vh]" : "h-[500px] max-h-[80vh]"

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative"
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="w-14 h-14 rounded-full bg-green-700 hover:bg-green-800 text-white shadow-lg"
              >
                <MessageSquare className="w-6 h-6" />
              </Button>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col ${chatWindowWidth} ${chatWindowHeight} border border-green-700 z-50`}
              style={{
                position: "fixed",
                bottom: "1.5rem",
                right: "1.5rem",
                transition: "width 0.2s ease, height 0.2s ease",
              }}
            >
              {/* Header */}
              <div className="bg-green-700 text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <h3 className="font-serif font-bold">Gladwell</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleExpand}
                    className="text-white hover:bg-green-800 h-8 w-8"
                    title={isExpanded ? "Minimize" : "Maximize"}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsOpen(false)
                      // Reset expanded state when closing
                      if (isExpanded) setIsExpanded(false)
                    }}
                    className="text-white hover:bg-green-800 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#f5f0e1] dark:bg-gray-900 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-green-700 text-white"
                          : "bg-[#fffaf0] dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-green-700/30"
                      }`}
                    >
                      <div className="text-sm font-serif" dangerouslySetInnerHTML={{ __html: message.content }} />
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#fffaf0] dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg p-3 max-w-[80%] border border-green-700/30">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-green-700 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-green-700 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-green-700 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              <div className="border-t border-green-700/20 bg-[#fffaf0] dark:bg-gray-800">
                <div
                  className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700"
                  onClick={() => setSuggestionsOpen(!suggestionsOpen)}
                >
                  <span className="text-sm font-medium text-green-800 dark:text-green-500">Ask Gladwell</span>
                  {suggestionsOpen ? (
                    <ChevronUp className="w-4 h-4 text-green-700" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-green-700" />
                  )}
                </div>

                <AnimatePresence>
                  {suggestionsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pb-2 flex flex-wrap gap-2">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-green-700/20 bg-white dark:bg-gray-800 flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Gladwell something..."
                  className="flex-1 border-green-700/30 focus-visible:ring-green-700"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="bg-green-700 hover:bg-green-800 text-white"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
