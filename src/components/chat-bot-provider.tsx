"use client"

import { useState, useEffect } from "react"
import ChatBot from "../app/chat-bot"

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

interface ChatData {
  events: EventData[]
  currentBook: BookData | null
  allBooks: BookData[]
}

export default function ChatBotProvider() {
  const [data, setData] = useState<ChatData>({
    events: [],
    currentBook: null,
    allBooks: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/chat-data")
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error("Failed to fetch chat data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return null // Don't render anything while loading
  }

  return <ChatBot initialEvents={data.events} initialBook={data.currentBook} allBooks={data.allBooks} />
}
