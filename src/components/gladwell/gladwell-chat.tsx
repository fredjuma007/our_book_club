"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Sparkles, Copy, Check, BookOpen, Calendar, Home, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

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

const linkifyText = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-emerald-500 dark:text-emerald-400 underline hover:text-emerald-600 dark:hover:text-emerald-300 font-medium break-all">${url}</a>`
  })
}

export function GladwellChat() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ConversationExchange[]>([])
  const [initialEvents, setInitialEvents] = useState<EventItem[]>([])
  const [initialBook, setInitialBook] = useState<BookItem | null>(null)
  const [allBooks, setAllBooks] = useState<BookItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [hasStartedChat, setHasStartedChat] = useState(false)

  const suggestions = ["Book of the month?", "Next event?", "How do I join the club?"]

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

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm Gladwell, the Reading Circle Assistant. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }
  }, [messages.length])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

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

    setHasStartedChat(true)

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
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: linkifyText("I'm here to help! Ask me about our books, events, or how to join the club."),
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      console.error("Error getting AI response:", error)

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: linkifyText("I'm here to help! Ask me about our books, events, or how to join the club."),
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
    setHasStartedChat(true)
    setInputValue(suggestion)
    setTimeout(() => handleSend(), 100)
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    const plainText = content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")

    try {
      await navigator.clipboard.writeText(plainText)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm Gladwell, the Reading Circle Assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ])
    setConversationHistory([])
    setHasStartedChat(false)
    setInputValue("")
  }

  return (
    <div className="flex bg-[#f5f0e1] dark:bg-gray-950 h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col border-r border-green-700/30 bg-[#fffaf0] dark:bg-gray-900">
        <div className="p-6 border-b border-green-700/30">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12">
              <Image
                src="/logo.jpg"
                alt="Gladwell"
                fill
                className="object-cover rounded-full ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all"
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-green-800 dark:text-foreground">Gladwell</h2>
              <p className="text-xs text-gray-600 dark:text-muted-foreground">Reading Circle Assistant</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-muted-foreground uppercase tracking-wider">
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Books Read</p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{allBooks.length || 20}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Events</p>
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{initialEvents.length || 19}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-muted-foreground uppercase tracking-wider">
              Quick Questions
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-accent text-sm transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 text-gray-800 dark:text-foreground group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">{index + 1}</span>
                    </div>
                    <span className="flex-1">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 pt-6 border-t border-green-700/30">
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-accent text-sm transition-all text-gray-800 dark:text-foreground group"
              >
                <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {!hasStartedChat && messages.length <= 1 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md w-full text-center space-y-8"
            >
              {/* Logo */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl overflow-hidden">
                    <Image
                      src="/logo.jpg"
                      alt="Gladwell"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="space-y-3">
                <h1 className="text-4xl font-serif font-bold text-green-800 dark:text-foreground">Hi! I'm Gladwell</h1>
                <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
                  I'm here to help you with information about our book club,
                  chat about books and authors, upcoming events and more!
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{allBooks.length || 20}</p>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Books Read</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800">
                  <div className="flex flex-col items-center gap-2">
                    <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {initialEvents.length || 19}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground">Events</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  Type a message below to get started ↓
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {hasStartedChat && (
          <div className="flex-1 overflow-y-auto px-4 py-6 pb-40 md:pb-32 space-y-6">
            {messages.slice(1).map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-emerald-600 dark:bg-emerald-700 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-foreground border border-green-700/30"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-700/20 dark:border-border">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Gladwell</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="text-gray-600 dark:text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                  <div
                    className={`text-sm leading-relaxed ${
                      message.sender === "user" ? "text-white" : "text-gray-800 dark:text-foreground"
                    }`}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                  <div
                    className={`text-xs mt-2 pt-2 border-t ${
                      message.sender === "user"
                        ? "border-white/20 text-emerald-100"
                        : "border-green-700/20 dark:border-border text-gray-600 dark:text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[75%] border border-green-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Gladwell is typing...
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="sticky bottom-0 border-t border-green-700/30 bg-[#fffaf0] dark:bg-gray-900 z-[100]">
          {/* Collapsible Suggestions Section for Mobile */}
          <div className="lg:hidden border-b border-green-700/30">
            <button
              onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-foreground hover:bg-emerald-50 dark:hover:bg-accent transition-colors"
            >
              <span>Quick Questions</span>
              {suggestionsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {suggestionsExpanded && (
              <div className="px-4 pb-3 space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      handleSuggestionClick(suggestion)
                      setSuggestionsExpanded(false)
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-accent text-sm transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 text-gray-800 dark:text-foreground group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">{index + 1}</span>
                      </div>
                      <span className="flex-1">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Updated Input Area with Clear Chat Button */}
          <div className="max-w-4xl mx-auto p-4 flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gladwell something..."
              rows={1}
              className="flex-1 border border-green-700/30 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 rounded-xl px-4 py-3 text-sm resize-none max-h-32 overflow-y-auto focus:outline-none focus:ring-2 bg-white dark:bg-background text-gray-800 dark:text-foreground"
            />
            <Button
              onClick={handleClearChat}
              variant="outline"
              className="border-green-700/30 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-800 text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-red-400 rounded-xl px-4 flex-shrink-0 transition-all bg-transparent"
              size="icon"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 flex-shrink-0"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-w-4xl mx-auto px-4 pb-3">
            <p className="text-xs text-gray-600 dark:text-muted-foreground text-center">
              Press Enter for new line, Cmd/Ctrl+Enter to send
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
