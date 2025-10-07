"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Maximize2, Minimize2, Send, ChevronDown, ChevronUp, BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

// Define types for the data
interface EventItem {
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

interface BookItem {
  _id: string
  title: string
  author: string
  coverImage?: string
  description?: string
  genre?: string
  _createdDate?: string
  publisher?: string
}

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

type ConversationExchange = {
  role: "user" | "assistant"
  content: string
}

interface GladwellAIWidgetProps {
  isOpen: boolean
  onClose: () => void
}

const linkifyText = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 font-medium break-all">${url}</a>`
  })
}

export default function GladwellAIWidget({ isOpen, onClose }: GladwellAIWidgetProps) {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ConversationExchange[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(true)
  const [initialEvents, setInitialEvents] = useState<EventItem[]>([])
  const [initialBook, setInitialBook] = useState<BookItem | null>(null)
  const [allBooks, setAllBooks] = useState<BookItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showGreeting, setShowGreeting] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme } = useTheme()

  // Extract book club statistics
  const bookCount = allBooks?.length || 0
  const authors = [...new Set((allBooks || []).map((book) => book.author).filter(Boolean))]
  const genres = [...new Set((allBooks || []).map((book) => book.genre).filter(Boolean))]
  const upcomingEventsCount = (initialEvents || []).filter((event) => new Date(event.date) > new Date()).length
  const pastEventsCount = (initialEvents || []).length - upcomingEventsCount
  const totalEventsCount = (initialEvents || []).length

  // Count books by author
  const authorCounts: Record<string, number> = {}
  const booksByAuthor: Record<string, { title: string; genre?: string; publisher?: string }[]> = {}

  if (allBooks && allBooks.length > 0) {
    allBooks.forEach((book) => {
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
  }

  const multipleReadAuthors = Object.keys(authorCounts)
    .filter((author) => authorCounts[author] > 1)
    .map((author) => ({
      name: author,
      count: authorCounts[author],
      books: booksByAuthor[author],
    }))

  const suggestions = [
    "Book of the month?",
    "Who are the moderators?",
    "Next event?",
    "Club statistics",
    "about the club",
    "How to join",
    "club guidelines",
  ]

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/chat-data")
        if (response.ok) {
          const result = await response.json()
          setInitialEvents(result.events || [])
          setInitialBook(result.currentBook || null)
          setAllBooks(result.allBooks || [])
        }
      } catch (error) {
        console.error("Failed to fetch chat data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: "👋 Hi there! I'm Gladwell, the Reading Circle Assistant. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputValue])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(false)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [showGreeting])

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isFullScreen])

  useEffect(() => {
    if (messages.length > 1) {
      const newHistory: ConversationExchange[] = []
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    try {
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
          conversationHistory: conversationHistory,
        }),
      })

      const data = await response.json()

      if (response.ok && !data.fallback) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: linkifyText(data.response),
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
        return
      }

      setTimeout(() => {
        const botResponse = generateResponse(inputValue)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: linkifyText(botResponse),
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      console.error("Error getting AI response:", error)

      setTimeout(() => {
        const botResponse = generateResponse(inputValue)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: linkifyText(botResponse),
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSend()
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
    setTimeout(scrollToBottom, 300)
  }

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim()

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
      return `I'm doing great, thanks for asking! 😊 As Gladwell, I'm always excited to talk about books and our reading club. How can I assist you today?`
    }

    if (
      lowerQuery.includes("who are you") ||
      lowerQuery.includes("what are you") ||
      lowerQuery.includes("your name") ||
      lowerQuery.includes("gladwell")
    ) {
      return `I'm Gladwell, the Reading Circle's digital assistant! 🤖 My name is a little nod to the three main moderators of the club The Gladwells. I'm here to help you with information about our events, current book selections, and how to join our community of book lovers! 📚`
    }

    if (
      lowerQuery.includes("statistics") ||
      lowerQuery.includes("stats") ||
      lowerQuery.includes("numbers") ||
      lowerQuery.includes("how many")
    ) {
      if (lowerQuery.includes("book") || lowerQuery.includes("read")) {
        return `<div class="space-y-3">
  <h4 class="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
    📚 Book Statistics
  </h4>
  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border-l-4 border-blue-500">
    <ul class="space-y-2">
      <li class="flex items-start gap-2">
        <span class="text-blue-600 dark:text-blue-400 font-bold">📖</span>
        <span><strong class="text-blue-700 dark:text-blue-300">Total books read:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">${bookCount}</span></span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-blue-600 dark:text-blue-400 font-bold">✍️</span>
        <span><strong class="text-blue-700 dark:text-blue-300">Authors explored:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">${authors.length}</span></span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-blue-600 dark:text-blue-400 font-bold">🎭</span>
        <span><strong class="text-blue-700 dark:text-blue-300">Genres covered:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">${genres.length}</span></span>
      </li>
    </ul>
  </div>
  <p class="text-sm text-gray-600 dark:text-gray-300 italic">Our members are always excited to discover new literary worlds together! ✨</p>
</div>`
      }

      if (lowerQuery.includes("event") || lowerQuery.includes("meeting")) {
        return `<div class="space-y-3">
  <h4 class="text-lg font-bold text-pink-600 dark:text-pink-400 flex items-center gap-2">
    📅 Event Statistics
  </h4>
  <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-lg border-l-4 border-pink-500">
    <ul class="space-y-2">
      <li class="flex items-start gap-2">
        <span class="text-pink-600 dark:text-pink-400 font-bold">🎉</span>
        <span><strong class="text-pink-700 dark:text-pink-300">Total events:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">${totalEventsCount}</span></span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-pink-600 dark:text-pink-400 font-bold">🔜</span>
        <span><strong class="text-pink-700 dark:text-pink-300">Upcoming events:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">${upcomingEventsCount}</span></span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-pink-600 dark:text-pink-400 font-bold">✅</span>
        <span><strong class="text-pink-700 dark:text-pink-300">Past gatherings:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">${pastEventsCount}</span></span>
      </li>
    </ul>
  </div>
  <p class="text-sm text-gray-600 dark:text-gray-300 italic">Our events include book discussions, author talks, and social gatherings! 🎊</p>
</div>`
      }

      return `<div class="space-y-3">
  <h4 class="text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
    📊 Club Statistics
  </h4>
  <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border-l-4 border-indigo-500">
    <ul class="space-y-2">
      <li class="flex items-start gap-2">
        <span class="text-indigo-600 dark:text-indigo-400 font-bold">📚</span>
        <span><strong class="text-indigo-700 dark:text-indigo-300">Books read:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">${bookCount}</span> books from <span class="text-purple-600 dark:text-purple-400 font-bold">${authors.length}</span> authors across <span class="text-purple-600 dark:text-purple-400 font-bold">${genres.length}</span> genres</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-indigo-600 dark:text-indigo-400 font-bold">🎪</span>
        <span><strong class="text-indigo-700 dark:text-indigo-300">Events hosted:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">${totalEventsCount}</span> events (<span class="text-purple-600 dark:text-purple-400 font-bold">${pastEventsCount}</span> past, <span class="text-purple-600 dark:text-purple-400 font-bold">${upcomingEventsCount}</span> upcoming)</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-indigo-600 dark:text-indigo-400 font-bold">👥</span>
        <span><strong class="text-indigo-700 dark:text-indigo-300">Community size:</strong> <span class="text-purple-600 dark:text-purple-400 font-bold">100+</span> passionate readers</span>
      </li>
    </ul>
  </div>
  <p class="text-sm text-gray-600 dark:text-gray-300 italic">Our community is growing with passionate readers who love to share their literary journeys! 🌟</p>
</div>`
    }

    if (
      lowerQuery.includes("author") ||
      lowerQuery.includes("writer") ||
      lowerQuery.includes("who wrote") ||
      lowerQuery.includes("who has written")
    ) {
      const authorsList = authors.slice(0, 5)
      const formattedAuthors = authorsList
        .map(
          (author) =>
            `<li class="flex items-start gap-2"><span class="text-teal-600 dark:text-teal-400">✍️</span><span>${author}</span></li>`,
        )
        .join("")

      return `<div class="space-y-3">
  <h4 class="text-lg font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
    ✍️ Author Insights
  </h4>
  <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 rounded-lg border-l-4 border-teal-500">
    <p class="mb-3 text-gray-700 dark:text-gray-200">The Reading Circle has explored works from <strong class="text-teal-700 dark:text-teal-300">${authors.length}</strong> different authors, including:</p>
    <ul class="space-y-2">
      ${formattedAuthors}
      ${authors.length > 5 ? '<li class="flex items-start gap-2"><span class="text-teal-600 dark:text-teal-400">📖</span><span class="italic">...and more!</span></li>' : ""}
    </ul>
  </div>
  <p class="text-sm text-gray-600 dark:text-gray-300 italic">We love discovering diverse voices and perspectives through our reading selections! 🌍</p>
</div>`
    }

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

    if (
      lowerQuery.includes("how many books") ||
      lowerQuery.includes("book count") ||
      lowerQuery.includes("number of books")
    ) {
      return `<h4 class="text-lg font-medium mb-2">📚 Gladwell's Book Count</h4>
<p class="mb-3">The Reading Circle has read <strong>${bookCount} books</strong> so far! Our members are always excited to add more great titles to this growing list.</p>`
    }

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

    if (
      lowerQuery.includes("who recommend") ||
      lowerQuery.includes("who suggested") ||
      lowerQuery.includes("recommender") ||
      lowerQuery.includes("recommended by")
    ) {
      let bookTitle = ""
      const words = lowerQuery.split(" ")

      for (let i = 0; i < words.length; i++) {
        if (
          words[i] === "recommend" ||
          words[i] === "recommended" ||
          words[i] === "suggests" ||
          words[i] === "suggested"
        ) {
          if (i + 1 < words.length) {
            bookTitle = words.slice(i + 1).join(" ")
            break
          }
        }
      }

      if (!bookTitle) {
        for (let i = 0; i < words.length; i++) {
          if (
            words[i] === "recommend" ||
            words[i] === "recommended" ||
            words[i] === "suggests" ||
            words[i] === "suggested"
          ) {
            if (i > 0) {
              bookTitle = words.slice(0, i).join(" ")
              break
            }
          }
        }
      }

      bookTitle = bookTitle.replace(/^who|^did|^who did|^the book/, "").trim()

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

    if (lowerQuery.includes("moderator") || lowerQuery.includes("leader") || lowerQuery.includes("who runs")) {
      return `<div class="space-y-3">
  <h4 class="text-lg font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
    👥 Meet Our Moderators
  </h4>
  <div class="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg border-l-4 border-orange-500">
    <p class="mb-3 text-gray-700 dark:text-gray-200">Our club is moderated by:</p>
    <ul class="space-y-3">
      <li class="flex items-start gap-2">
        <span class="text-orange-600 dark:text-orange-400 font-bold">📅</span>
        <span><strong class="text-orange-700 dark:text-orange-300">Esther Mboche</strong> - Events Coordinator</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-orange-600 dark:text-orange-400 font-bold">👤</span>
        <span><strong class="text-orange-700 dark:text-orange-300">Brenda Frenjo</strong> - Membership & Reviews</span>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-orange-600 dark:text-orange-400 font-bold">📚</span>
        <span><strong class="text-orange-700 dark:text-orange-300">Fred Juma</strong> - Books & Reviews</span>
      </li>
    </ul>
  </div>
  <p class="text-sm text-gray-600 dark:text-gray-300">You can learn more about them on our <a href="/about-us" class="underline text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">about us page</a>. 🌟</p>
</div>`
    }

    if (lowerQuery.includes("join") || lowerQuery.includes("become member") || lowerQuery.includes("sign up")) {
      return `<div class="p-3 rounded-md border mb-3">
  <h4 class="text-lg font-medium mb-2">🎉 Join The Reading Circle</h4>
  <p class="mb-3">We'd love to have you join! Please fill out our application form on the <a href="/join-us" class="underline">join us page</a>.</p>
  <p class="mb-3">We'll ask about your reading habits and interests to help integrate you into our community.</p>
</div>`
    }

    if (lowerQuery.includes("schedule") || lowerQuery.includes("when") || lowerQuery.includes("meeting time")) {
      return `<h4 class="text-lg font-medium mb-2">🕒 Gladwell's Schedule Update</h4>
<p class="mb-3">We typically meet a maximum of twice a month:</p>
<ul class="list-disc pl-5 space-y-2">
  <li>Once for a book discussion</li>
  <li>Once for a social gathering or special event</li>
</ul>
<p class="mb-3">We've hosted ${totalEventsCount} events so far! Check our <a href="/club-events" class="underline">events calendar</a> for specific dates and times.</p>`
    }

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

    if (
      lowerQuery.includes("handsome") ||
      lowerQuery.includes("who is handsome") ||
      lowerQuery.includes("most handsome")
    ) {
      return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3">The most handsome member of the club is <strong>Fred Juma</strong>. He is the one who always brings the best snacks to our meetings!</p>
</div>`
    }

    if (lowerQuery.includes("brenda") || lowerQuery.includes("height") || lowerQuery.includes("how tall is brenda")) {
      return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3"><strong>Brenda Frenjo</strong> is 5'8" tall. She can clearly see tomorrow's book club meeting from her house!</p>
</div>`
    }

    if (
      lowerQuery.includes("esther") ||
      lowerQuery.includes("vibes") ||
      lowerQuery.includes("how are esther's vibes")
    ) {
      return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3"><strong>Esther Mboche</strong> gives off prefect vibes. She is the one who always keeps us on track during our meetings! Don't be surprised if she gives you a warning for talking too much!</p>
</div>`
    }

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

    if (
      lowerQuery.includes("photo") ||
      lowerQuery.includes("picture") ||
      lowerQuery.includes("image") ||
      lowerQuery.includes("gallery")
    ) {
      return `<h4 class="text-lg font-medium mb-2">📸 Gladwell's Gallery Guide</h4>
<p class="mb-3">You can view photos from our past events and gatherings in our <a href="/gallery" class="underline">gallery page</a>. We love capturing memories from our book discussions and social events!</p>`
    }

    if (
      lowerQuery.includes("recommend") ||
      lowerQuery.includes("suggestion") ||
      lowerQuery.includes("what should i read")
    ) {
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

    return `<div class="p-3 rounded-md border mb-3">
  <p class="mb-3">This is Gladwell! I'm not sure about that, but I can tell you that The Reading Circle has read ${bookCount} books and hosted ${totalEventsCount} events so far!</p>
  <p class="mb-3">Would you like to know about our:</p>
  <ul class="list-disc pl-5 space-y-2">
    <li><a href="/club-events" class="underline">Upcoming events</a></li>
    <li><a href="/books" class="underline">Current book</a></li>
    <li><a href="/join-us" class="underline">How to join</a></li>
  </ul>
</div>`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        theme === "dark" ? "bg-black/70" : "bg-black/50"
      } backdrop-blur-sm`}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        exit={{ y: 20 }}
        className={`${
          isFullScreen ? "w-[90%] max-w-5xl rounded-xl" : "w-full max-w-2xl rounded-xl"
        } bg-white dark:bg-gray-900 overflow-hidden shadow-2xl border border-green-700/50 transition-all duration-300 flex flex-col`}
        style={{ height: isFullScreen ? "85vh" : "min(80vh, 600px)" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">Gladwell</h3>
              <p className="text-xs text-emerald-100">Reading Circle Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullScreen}
              className="text-white hover:bg-white/20 h-8 w-8 transition-colors"
              title={isFullScreen ? "Minimize" : "Maximize"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-emerald-50/30 to-green-50/30 dark:from-gray-900 dark:to-gray-800 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-emerald-600 to-green-600 text-white ml-auto"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-2 border-emerald-100 dark:border-emerald-900/30"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-100 dark:border-emerald-900/30">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Gladwell</span>
                  </div>
                )}
                <div
                  className={`text-sm leading-relaxed font-serif ${
                    message.sender === "user" ? "text-white" : "text-gray-700 dark:text-gray-200"
                  }`}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
                <div
                  className={`text-xs mt-2 pt-2 border-t ${
                    message.sender === "user"
                      ? "border-white/20 text-emerald-100"
                      : "border-emerald-100 dark:border-emerald-900/30 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-[85%] border-2 border-emerald-100 dark:border-emerald-900/30 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Gladwell is typing...
                  </span>
                </div>
                <div className="flex space-x-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="border-t-2 border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-gray-800">
          <div
            className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-emerald-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => setSuggestionsOpen(!suggestionsOpen)}
          >
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Quick Questions
            </span>
            {suggestionsOpen ? (
              <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full hover:from-emerald-200 hover:to-green-200 dark:hover:from-emerald-900/50 dark:hover:to-green-900/50 transition-all shadow-sm hover:shadow-md font-medium"
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
        <div className="p-4 border-t-2 border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-gray-800 flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Gladwell something..."
            rows={1}
            className="flex-1 border-2 border-emerald-200 dark:border-emerald-900/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl px-4 py-2 text-sm resize-none max-h-32 overflow-y-auto focus:outline-none focus:ring-2"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 flex-shrink-0"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="px-4 pb-2 bg-white dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Press Enter for new line, Cmd/Ctrl+Enter to send
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
