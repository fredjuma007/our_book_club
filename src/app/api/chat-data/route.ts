import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/wix"

// Define types for Wix data items
interface EventItem {
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
}

export async function GET() {
  try {
    const client = await getServerClient()

    // Fetch upcoming events
    const currentDate = new Date().toISOString()
    const eventsResponse = await client.items
      .queryDataItems({
        dataCollectionId: "Events",
      })
      .find()

    // Filter events manually
    const events = eventsResponse.items
      .filter((item) => item.data)
      .map((item) => item.data as EventItem)
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        // Sort upcoming events by nearest first
        if (dateA > new Date() && dateB > new Date()) {
          return dateA.getTime() - dateB.getTime()
        }
        // Sort past events by most recent first
        return dateB.getTime() - dateA.getTime()
      })

    // Fetch all books
    const booksResponse = await client.items
      .queryDataItems({
        dataCollectionId: "Books",
      })
      .find()

    // Get all books
    const allBooks = booksResponse.items
      .filter((item) => item.data)
      .map((item) => ({
        ...(item.data as BookItem),
        _createdDate: (item as any)?.metadata?.createdDate || null,
      }))

    // Sort books by creation date (newest first)
    const sortedBooks = allBooks.sort((a, b) => {
      const dateA = a._createdDate ? new Date(a._createdDate).getTime() : 0
      const dateB = b._createdDate ? new Date(b._createdDate).getTime() : 0
      return dateB - dateA
    })

    // Get the most recent book as the current book of the month
    const currentBook = sortedBooks.length > 0 ? sortedBooks[0] : null

    return NextResponse.json({
      events: events,
      currentBook: currentBook,
      allBooks: allBooks,
    })
  } catch (error) {
    console.error("Error fetching chat data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
