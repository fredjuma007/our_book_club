"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageSquare, X, Send, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type ChatBotProps = {
  initialEvents: any[]
  initialBook: any | null
  allBooks: any[]
}

const linkifyText = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 font-medium break-all">${url}</a>`
  })
}

export default function ChatBot({
  initialEvents: propEvents = [],
  initialBook: propBook = null,
  allBooks: propBooks = [],
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showGreeting, setShowGreeting] = useState(true)
  const [bookCount, setBookCount] = useState(0)
  const [authors, setAuthors] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [totalEventsCount, setTotalEventsCount] = useState(0)
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0)
  const [pastEventsCount, setPastEventsCount] = useState(0)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([])
  const [isTyping, setIsTyping] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [initialEvents, setInitialEvents] = useState(propEvents)
  const [initialBook, setInitialBook] = useState(propBook)
  const [allBooks, setAllBooks] = useState(propBooks)
  const [isLoadingData, setIsLoadingData] = useState(true)

  const suggestions = ["Book of the month?", "Who are the moderators?", "Next event?", "Club statistics", "How to join"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/chat-data")
        if (response.ok) {
          const data = await response.json()
          setInitialEvents(data.events || [])
          setInitialBook(data.currentBook || null)
          setAllBooks(data.allBooks || [])
        }
      } catch (error) {
        console.error("[v0] Failed to fetch chat data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setBookCount(allBooks.length)
    setAuthors(Array.from(new Set(allBooks.map((book) => book.author))))
    setGenres(Array.from(new Set(allBooks.map((book) => book.genre))))
    setTotalEventsCount(initialEvents.length)
    const now = new Date()
    const upcomingEvents = initialEvents.filter((event) => new Date(event.date) > now)
    const pastEvents = initialEvents.filter((event) => new Date(event.date) <= now)
    setUpcomingEventsCount(upcomingEvents.length)
    setPastEventsCount(pastEvents.length)
  }, [allBooks, initialEvents])

  useEffect(() => {
    if (messages.length > 0) {
      const newHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
      setConversationHistory(newHistory)
    }
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

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

      // General statistics
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

    // Fallback response
    return `<div class="space-y-3">
  <div class="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 p-4 rounded-lg border-l-4 border-gray-400 dark:border-gray-700">
    <p class="mb-3 text-gray-700 dark:text-gray-200">This is Gladwell! 🤖 I'm not sure about that, but I can tell you that The Reading Circle has read <strong class="text-emerald-600 dark:text-emerald-400">${bookCount}</strong> books and hosted <strong class="text-pink-600 dark:text-pink-400">${totalEventsCount}</strong> events so far!</p>
    <p class="mb-2 font-semibold text-gray-800 dark:text-gray-100">Would you like to know about our:</p>
    <ul class="space-y-2">
      <li class="flex items-start gap-2">
        <span class="text-blue-600 dark:text-blue-400">📅</span>
        <a href="/club-events" class="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Upcoming events</a>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-green-600 dark:text-green-400">📖</span>
        <a href="/books" class="underline text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">Current book</a>
      </li>
      <li class="flex items-start gap-2">
        <span class="text-purple-600 dark:text-purple-400">🎉</span>
        <a href="/join-us" class="underline text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">How to join</a>
      </li>
    </ul>
  </div>
</div>`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
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
          message: userMessage,
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
        setMessages((prev) => [...prev, { role: "assistant", content: linkifyText(data.response) }])
        setIsTyping(false)
        return
      }

      setTimeout(() => {
        const fallbackResponse = generateResponse(userMessage)
        setMessages((prev) => [...prev, { role: "assistant", content: linkifyText(fallbackResponse) }])
        setIsTyping(false)
      }, 500)
    } catch (error) {
      console.error("Error getting AI response:", error)

      setTimeout(() => {
        const fallbackResponse = generateResponse(userMessage)
        setMessages((prev) => [...prev, { role: "assistant", content: linkifyText(fallbackResponse) }])
        setIsTyping(false)
      }, 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 md:w-[500px] lg:w-[600px] h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Gladwell</h3>
                  <p className="text-xs text-emerald-100">Your Reading Circle Assistant</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Hi! I'm Gladwell</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Ask me anything about our book club like, upcoming events, or the current book selection!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <div
                        className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    </div>
                  )}
                  {message.role === "user" && (
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] shadow-sm">
                      {message.content}
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-200 dark:border-gray-700">
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
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything... (Cmd/Ctrl+Enter to send)"
                  rows={1}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white resize-none max-h-32 overflow-y-auto"
                />
                <Button
                  onClick={handleSend}
                  className="rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Collapsible suggestions section */}
              <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                <div
                  className="flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition-colors"
                  onClick={() => setSuggestionsOpen(!suggestionsOpen)}
                >
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Quick Questions</span>
                  {suggestionsOpen ? (
                    <ChevronUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
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
                      <div className="mt-2 flex flex-wrap gap-2">
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

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Press Enter for new line, Cmd/Ctrl+Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                className="w-14 h-14 rounded-full bg-green-700 hover:bg-green-800 text-white shadow-lg relative z-10"
              >
                <MessageSquare className="w-6 h-6" />
              </Button>
              <motion.div
                className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full px-2 py-0.5 flex items-center justify-center shadow-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 0 rgba(139, 92, 246, 0.4)",
                    "0 0 20px rgba(139, 92, 246, 0.6)",
                    "0 0 0 rgba(139, 92, 246, 0.4)",
                  ],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                  duration: 1.5,
                }}
              >
                <span className="text-white text-xs font-bold tracking-wider">AI</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
