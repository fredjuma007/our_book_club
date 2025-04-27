import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const client = await getServerClient()

    // Fetch featured book from Wix CMS
    const featuredBooksData = await client.items
      .queryDataItems({ dataCollectionId: "FeaturedBooks" })
      .find()
      .then((res) => res.items.map((item) => item.data || {}))

    // Get the most recent featured book (or the one marked as current)
    const featuredBookItems = featuredBooksData.filter(
      (
        item,
      ): item is {
        _id: string
        title: string
        author: string
        quote: string
        description: string
        meetingDate: string
        meetingLink: string
        coverImage?: any
        isBookOfMonth?: boolean
        bookLink?: string
      } => !!item && typeof item === "object",
    )

    // Sort by isBookOfMonth first (if available), then by most recent
    const sortedBooks = featuredBookItems.sort((a, b) => {
      // First prioritize books marked as "Book of the Month"
      if (a.isBookOfMonth && !b.isBookOfMonth) return -1
      if (!a.isBookOfMonth && b.isBookOfMonth) return 1

      // If both have same isBookOfMonth status, sort by date (assuming meetingDate is a date string)
      const dateA = new Date(a.meetingDate || "")
      const dateB = new Date(b.meetingDate || "")
      return dateB.getTime() - dateA.getTime() // Most recent first
    })

    // Take the first book as the featured one
    const featuredBook = sortedBooks[0]

    if (!featuredBook) {
      return NextResponse.json(
        {
          error: "No featured book found",
        },
        { status: 404 },
      )
    }

    // Process the featured book to add proper image URL
    let coverImageUrl = ""
    try {
      if (featuredBook.coverImage) {
        coverImageUrl = convertWixImageToUrl(featuredBook.coverImage)
      }
    } catch (error) {
      console.error("Error converting cover image URL:", error)
    }

    // Format the date for display
    let formattedDate = ""
    try {
      if (featuredBook.meetingDate) {
        const meetingDate = new Date(featuredBook.meetingDate)
        formattedDate = meetingDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
        })
      }
    } catch (error) {
      console.error("Error formatting date:", error)
    }

    const processedFeaturedBook = {
      id: featuredBook._id,
      title: featuredBook.title || "",
      author: featuredBook.author || "",
      quote: featuredBook.quote || "",
      description: featuredBook.description || "",
      meetingDate: formattedDate,
      meetingLink: featuredBook.meetingLink || "",
      coverImage: coverImageUrl,
      bookLink: featuredBook.bookLink || "",
    }

    return NextResponse.json(processedFeaturedBook)
  } catch (error) {
    console.error("Error fetching featured book:", error)
    return NextResponse.json({ error: "Failed to fetch featured book" }, { status: 500 })
  }
}
