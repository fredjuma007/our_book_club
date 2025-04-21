"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, BookOpen, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Define types for the data
interface EventData {
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
}

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

type ChatBotProps = {
  initialEvents?: EventData[]
  initialBook?: BookData | null
  allBooks?: BookData[]
}

export default function ChatBot({ initialEvents = [], initialBook = null, allBooks = [] }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
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

  // Extract book club statistics
  const bookCount = allBooks.length
  const authors = [...new Set(allBooks.map((book) => book.author).filter(Boolean))]
  const genres = [...new Set(allBooks.map((book) => book.genre).filter(Boolean))]
  const upcomingEventsCount = initialEvents.filter((event) => new Date(event.date) > new Date()).length
  const pastEventsCount = initialEvents.length - upcomingEventsCount
  const totalEventsCount = initialEvents.length

  // Sample suggestions
  const suggestions = [
    "Hello Gladwell!",
    "Book of the month?",
    "How many books?",
    "Popular genres?",
    "Next event?",
    "Club statistics",
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

    // Simulate bot thinking
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSend()
  }

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
      return `I'm Gladwell, the Reading Circle's digital assistant! My name is a little nod to the three moderstors of the club Gladwells. I'm here to help you with information about our events, current book selections, and how to join our community of book lovers!`
    }

    // Book club statistics
    if (
      lowerQuery.includes("statistics") ||
      lowerQuery.includes("stats") ||
      lowerQuery.includes("numbers") ||
      lowerQuery.includes("how many")
    ) {
      if (lowerQuery.includes("book") || lowerQuery.includes("read")) {
        return `📚 Gladwell's book stats: The Reading Circle has read ${bookCount} books so far! We've explored works from ${authors.length} different authors across ${genres.length} genres. Our members are always excited to discover new literary worlds together!`
      }

      if (lowerQuery.includes("event") || lowerQuery.includes("meeting")) {
        return `📅 Gladwell's event stats: The Reading Circle has hosted ${totalEventsCount} events in total! We have ${upcomingEventsCount} upcoming events and have completed ${pastEventsCount} past gatherings. Our events include book discussions, author talks, and social gatherings.`
      }

      // General statistics
      return `📊 Gladwell's club statistics: The Reading Circle has read ${bookCount} books from ${authors.length} authors across ${genres.length} genres. We've hosted ${totalEventsCount} events (${pastEventsCount} past, ${upcomingEventsCount} upcoming). Our community is growing with passionate readers who love to share their literary journeys!`
    }

    // Authors information
    if (
      lowerQuery.includes("author") ||
      lowerQuery.includes("writer") ||
      lowerQuery.includes("who wrote") ||
      lowerQuery.includes("who has written")
    ) {
      const authorsList = authors.slice(0, 5).join(", ") + (authors.length > 5 ? ", and more" : "")
      return `✍️ Gladwell's author insights: The Reading Circle has explored works from ${authors.length} different authors, including ${authorsList}. We love discovering diverse voices and perspectives through our reading selections!`
    }

    // Genres information
    if (lowerQuery.includes("genre") || lowerQuery.includes("type of book") || lowerQuery.includes("category")) {
      const genresList = genres.slice(0, 5).join(", ") + (genres.length > 5 ? ", and more" : "")
      return `📚 Gladwell's genre guide: The Reading Circle has explored ${genres.length} different genres, including ${genresList}. We enjoy diversifying our reading experiences across different literary categories!`
    }

    // Book count
    if (
      lowerQuery.includes("how many books") ||
      lowerQuery.includes("book count") ||
      lowerQuery.includes("number of books")
    ) {
      return `📚 Gladwell's book count: The Reading Circle has read ${bookCount} books so far! Our members are always excited to add more great titles to this growing list.`
    }

    // Events information
    if (
      lowerQuery.includes("what is the reading circle") ||
      lowerQuery.includes("what's the reading circle") ||
      lowerQuery.includes("who are we") ||
      lowerQuery.includes("about the club") ||
      lowerQuery.includes("tell me about the club")
    ) {
      return `The Reading Circle is a vibrant community of book lovers who gather to discuss, share, and celebrate our love for literature. We've read ${bookCount} books across ${genres.length} genres and hosted ${totalEventsCount} events. Our club is moderated by Esther Mboche (Events Coordinator), Brenda Frenjo (Membership & Reviews), and Fred Juma (Books & Reviews). We aim to create a welcoming and inclusive environment where everyone feels valued and inspired to explore new genres and authors.`
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
        return `📅 Gladwell here with the details! Our next event is "${nextEvent.title}" on ${new Date(nextEvent.date).toLocaleDateString()} at ${nextEvent.time}, ${nextEvent.location}. You can find more details on our <a href="/club-events" class="text-green-700 underline">events page</a>.`
      }
      return `📅 Gladwell here! You can find our upcoming events on the <a href="/club-events" class="text-green-700 underline">events page</a>. We regularly host book discussions, author talks, and social gatherings.`
    }

    // Current book
    if (
      lowerQuery.includes("book of the month") ||
      lowerQuery.includes("current book") ||
      lowerQuery.includes("reading now") ||
      lowerQuery.includes("what are we reading")
    ) {
      if (initialBook) {
        return `📚 Gladwell's book update: We're currently reading "${initialBook.title}" by ${initialBook.author}${initialBook.genre ? ` in the ${initialBook.genre} genre` : ""}. Join us for the discussion on our next meeting!`
      }
      return `📚 Gladwell here! You can find our current book selection on the <a href="/books" class="text-green-700 underline">books page</a>. We select a new book each month through member voting.`
    }

    // All books
    if (
      lowerQuery.includes("all books") ||
      lowerQuery.includes("book list") ||
      lowerQuery.includes("reading list") ||
      lowerQuery.includes("what have we read")
    ) {
      const recentBooks = allBooks
        .slice(0, 3)
        .map((book) => `"${book.title}" by ${book.author}`)
        .join(", ")
      return `📚 Gladwell's reading list: The Reading Circle has read ${bookCount} books so far! Some of our recent selections include ${recentBooks}. You can view our complete reading history on the <a href="/books" class="text-green-700 underline">books page</a>.`
    }

    // Moderators
    if (lowerQuery.includes("moderator") || lowerQuery.includes("leader") || lowerQuery.includes("who runs")) {
      return `👥 Gladwell reporting! Our club is moderated by Esther Mboche (Events Coordinator), Brenda Frenjo (Membership & Reviews), and Fred Juma (Books & Reviews). You can learn more about them on our <a href="/about-us" class="text-green-700 underline">about us page</a>.`
    }

    // How to join
    if (lowerQuery.includes("join") || lowerQuery.includes("become member") || lowerQuery.includes("sign up")) {
      return `🎉 Gladwell here with good news! We'd love to have you join! Please fill out our application form on the <a href="/join-us" class="text-green-700 underline">join us page</a>. We'll ask about your reading habits and interests to help integrate you into our community.`
    }

    // Meeting schedule
    if (lowerQuery.includes("schedule") || lowerQuery.includes("when") || lowerQuery.includes("meeting time")) {
      return `🕒 Gladwell's schedule update: We typically meet twice a month - once for a book discussion and once for a social gathering or special event. We've hosted ${totalEventsCount} events so far! Check our <a href="/club-events" class="text-green-700 underline">events calendar</a> for specific dates and times.`
    }

    // Guidelines
    if (lowerQuery.includes("guideline") || lowerQuery.includes("rule") || lowerQuery.includes("expectation")) {
      return `📝 Gladwell here with the guidelines! Our club guidelines include reading the selected book before meetings, engaging in respectful discussions, and participating in regular check-ins. You can read the full guidelines on our <a href="/join-us?tab=guidelines" class="text-green-700 underline">join us page</a>.`
    }

    // Handsome member
    if (lowerQuery.includes("handsome") || lowerQuery.includes("who is handsome") || lowerQuery.includes("most handsome")) {
        return `The most handsome member of the club is Fred Juma. He is the one who always brings the best snacks to our meetings!`
    }

    // Gallery
    if (
      lowerQuery.includes("photo") ||
      lowerQuery.includes("picture") ||
      lowerQuery.includes("image") ||
      lowerQuery.includes("gallery")
    ) {
      return `📸 Gladwell's gallery guide: You can view photos from our past events and gatherings in our <a href="/gallery" class="text-green-700 underline">gallery page</a>. We love capturing memories from our book discussions and social events!`
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
        .map((book) => `"${book.title}" by ${book.author}${book.genre ? ` (${book.genre})` : ""}`)
        .join(", ")

      return `📚 Gladwell's recommendations: Based on our club's favorites, you might enjoy ${randomBooks}. We've read ${bookCount} books across ${genres.length} genres so far! What genres do you typically enjoy?`
    }

    // Fallback response
    return `This is Gladwell! I'm not sure about that, but I can tell you that The Reading Circle has read ${bookCount} books and hosted ${totalEventsCount} events so far! Would you like to know about our <a href="/club-events" class="text-green-700 underline">upcoming events</a>, <a href="/books" class="text-green-700 underline">current book</a>, or <a href="/join-us" class="text-green-700 underline">how to join</a>?`
  }

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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col w-80 sm:w-96 h-[500px] max-h-[80vh] border border-green-700"
            >
              {/* Header */}
              <div className="bg-green-700 text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <h3 className="font-serif font-bold">Gladwell</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-800 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
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
