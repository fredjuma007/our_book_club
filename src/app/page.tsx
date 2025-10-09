import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import HomePageClient from "./home-client"
import ErrorBoundary from "@/components/error-boundary"
import { convertWixEventData } from "@/lib/event-utils"

export default async function HomePage() {
  let randomGalleryItems: {
    id: string
    title: string
    caption: string
    src: string
    isVideo: boolean
    date: string
    category: string
  }[] = []

  // Initialize upcomingEvents array
  let upcomingEvents: {
    id: string
    title: string
    eventDate: string
    time: string
    location: string
    type: string
    bookTitle: string
    bookAuthor?: string
    imageUrl?: string
    link?: string
  }[] = []

  // Initialize testimonials array
  let randomTestimonials: {
    id: string
    title: string
    role: string
    quote: string
    avatar: string
  }[] = []

  // Initialize featured book
  let featuredBook: {
    id: string
    title: string
    author: string
    quote: string
    description: string
    meetingDate: string
    meetingLink: string
    coverImage: string
    bookLink: string
  } | null = null

  // Initialize stats data
  let statsData = {
    booksCount: 0,
    eventsCount: 0,
    reviewsCount: 0,
    galleryCount: 0,
  }

  try {
    // Fetch gallery items and events from Wix
    const client = await getServerClient()
    const currentDate = new Date()

    // Fetch gallery items from Wix CMS with a timeout
    const galleryDataPromise = new Promise<any[]>(async (resolve, reject) => {
      // Set a timeout for the entire operation
      const timeout = setTimeout(() => {
        reject(new Error("Gallery data fetch timed out after 10 seconds"))
      }, 10000)

      try {
        const data = await client.items
          .query("Gallery")
          .find()
          .then((res) => res.items)
          .catch((error) => {
            console.error("Error fetching gallery items:", error)
            return []
          })

        clearTimeout(timeout)
        resolve(data)
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })

    // Fetch events data with a timeout
    const eventsDataPromise = new Promise<any[]>(async (resolve, reject) => {
      // Set a timeout for the entire operation
      const timeout = setTimeout(() => {
        reject(new Error("Events data fetch timed out after 10 seconds"))
      }, 10000)

      try {
        const data = await client.items
          .query("Events")
          .find()
          .then((res) => res.items)
          .catch((error) => {
            console.error("Error fetching events:", error)
            return []
          })

        clearTimeout(timeout)
        resolve(data)
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })

    // Fetch testimonials data with a timeout
    const testimonialsDataPromise = new Promise<any[]>(async (resolve, reject) => {
      // Set a timeout for the entire operation
      const timeout = setTimeout(() => {
        reject(new Error("Testimonials data fetch timed out after 10 seconds"))
      }, 10000)

      try {
        const data = await client.items
          .query("Testimonials")
          .find()
          .then((res) => res.items)
          .catch((error) => {
            console.error("Error fetching testimonials:", error)
            return []
          })

        clearTimeout(timeout)
        resolve(data)
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })

    // Fetch featured book data with a timeout
    const featuredBookDataPromise = new Promise<any[]>(async (resolve, reject) => {
      // Set a timeout for the entire operation
      const timeout = setTimeout(() => {
        reject(new Error("Featured book data fetch timed out after 10 seconds"))
      }, 10000)

      try {
        const data = await client.items
          .query("FeaturedBooks")
          .find()
          .then((res) => res.items)
          .catch((error) => {
            console.error("Error fetching featured book:", error)
            return []
          })

        clearTimeout(timeout)
        resolve(data)
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })

    // Fetch stats data with a timeout
    const statsDataPromise = new Promise<{
      booksCount: number
      eventsCount: number
      reviewsCount: number
      galleryCount: number
    }>(async (resolve, reject) => {
      // Set a timeout for the entire operation
      const timeout = setTimeout(() => {
        reject(new Error("Stats data fetch timed out after 10 seconds"))
      }, 10000)

      try {
        const [booksResult, eventsResult, reviewsResult, galleryResult] = await Promise.all([
          client.items
            .query("Books")
            .find()
            .catch(() => ({ items: [] })),
          client.items
            .query("Events")
            .find()
            .catch(() => ({ items: [] })),
          client.items
            .query("Reviews")
            .find()
            .catch(() => ({ items: [] })),
          client.items
            .query("Gallery")
            .find()
            .catch(() => ({ items: [] })),
        ])

        clearTimeout(timeout)
        resolve({
          booksCount: booksResult.items.length,
          eventsCount: eventsResult.items.length,
          reviewsCount: reviewsResult.items.length,
          galleryCount: galleryResult.items.length,
        })
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })

    // Wait for all data fetches with timeouts
    const [galleryData, eventsData, testimonialsData, featuredBookData, fetchedStatsData] = await Promise.all([
      galleryDataPromise,
      eventsDataPromise,
      testimonialsDataPromise,
      featuredBookDataPromise,
      statsDataPromise,
    ])

    // Update stats data
    statsData = fetchedStatsData

    // Process gallery items
    const galleryItems = galleryData.filter(
      (
        item,
      ): item is {
        _id: string
        title: string
        caption: string
        isVideo?: boolean
        image?: any
        date?: string
        category?: string
      } => !!item && typeof item === "object",
    )

    // Process the gallery items to add proper image URLs
    const processedGalleryItems = galleryItems.map((item) => {
      // Get the image URL with error handling
      let imageUrl = "/placeholder.svg"
      try {
        if (item.image) {
          imageUrl = convertWixImageToUrl(item.image)
        }
      } catch (error) {
        console.error("Error converting image URL:", error)
      }

      return {
        id: item._id,
        title: item.title || "",
        caption: item.caption || "",
        src: imageUrl,
        isVideo: item.isVideo || false,
        date: item.date || "",
        category: item.category || "",
      }
    })

    // Shuffle the array to get random items
    const shuffled = [...processedGalleryItems]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Take the first 3 items for the preview
    randomGalleryItems = shuffled.slice(0, 3)

    // Process events data
    const processedEvents = eventsData
      .map((item) => convertWixEventData(item))
      .filter(
        (
          event,
        ): event is {
          _id: string
          title: string
          date: string
          time: string
          location: string
          type?: string
          bookTitle?: string
          bookAuthor?: string
          image?: any
          link?: string
          isPast?: boolean
          moderators: string[]
          description: string
        } =>
          !!event &&
          typeof event._id === "string" &&
          Array.isArray(event.moderators) &&
          typeof event.description === "string",
      )

    // Filter for upcoming events
    const upcoming = processedEvents.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= currentDate && !event.isPast
    })

    // Sort by date (nearest first)
    upcoming.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    // Take the first 3 upcoming events
    upcomingEvents = upcoming.slice(0, 3).map((event) => {
      // Format the date for display
      const eventDate = new Date(event.date)
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Get the image URL with error handling
      let imageUrl = "/placeholder.svg?height=300&width=400"
      try {
        if (event.image) {
          imageUrl = convertWixImageToUrl(event.image)
        }
      } catch (error) {
        console.error("Error converting event image URL:", error)
      }

      return {
        id: event._id,
        title: event.title,
        eventDate: formattedDate,
        time: event.time,
        location: event.location,
        type: event.type || "Event",
        bookTitle: event.bookTitle || "TBA",
        bookAuthor: event.bookAuthor,
        imageUrl: imageUrl,
        link: event.link,
      }
    })

    // Process testimonials data
    const testimonialItems = testimonialsData.filter(
      (
        item,
      ): item is {
        _id: string
        title: string
        role: string
        quote: string
        avatar?: any
      } => !!item && typeof item === "object",
    )

    // Process the testimonial items to add proper image URLs
    const processedTestimonials = testimonialItems.map((item) => {
      // Get the avatar URL with error handling
      let avatarUrl = "/placeholder.svg?height=60&width=60"
      try {
        if (item.avatar) {
          avatarUrl = convertWixImageToUrl(item.avatar)
        }
      } catch (error) {
        console.error("Error converting avatar URL:", error)
      }

      // Ensure name is being accessed correctly
      const memberName = item.title || ""

      return {
        id: item._id,
        title: memberName,
        role: item.role || "",
        quote: item.quote || "",
        avatar: avatarUrl,
      }
    })

    // Shuffle the testimonials array to get random items
    const shuffledTestimonials = [...processedTestimonials]
    for (let i = shuffledTestimonials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledTestimonials[i], shuffledTestimonials[j]] = [shuffledTestimonials[j], shuffledTestimonials[i]]
    }

    // Take the first 3 testimonials for the preview
    randomTestimonials = shuffledTestimonials.slice(0, 3)

    // Process featured book data
    if (featuredBookData && featuredBookData.length > 0) {
      const featuredBookItems = featuredBookData.filter(
        (
          item,
        ): item is {
          bookLink: string
          _id: string
          title: string
          author: string
          quote: string
          description: string
          meetingDate: string
          meetingLink: string
          coverImage?: any
          isBookOfMonth?: boolean
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
      const currentFeaturedBook = sortedBooks[0]

      if (currentFeaturedBook) {
        // Process the featured book to add proper image URL
        let coverImageUrl = ""
        try {
          if (currentFeaturedBook.coverImage) {
            coverImageUrl = convertWixImageToUrl(currentFeaturedBook.coverImage)
          }
        } catch (error) {
          console.error("Error converting cover image URL:", error)
        }

        // Format the date for display
        let formattedDate = ""
        try {
          if (currentFeaturedBook.meetingDate) {
            const meetingDate = new Date(currentFeaturedBook.meetingDate)
            formattedDate = meetingDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
            })
          }
        } catch (error) {
          console.error("Error formatting date:", error)
        }

        featuredBook = {
          id: currentFeaturedBook._id,
          title: currentFeaturedBook.title || "",
          author: currentFeaturedBook.author || "",
          quote: currentFeaturedBook.quote || "",
          description: currentFeaturedBook.description || "",
          meetingDate: formattedDate,
          meetingLink: currentFeaturedBook.meetingLink || "",
          coverImage: coverImageUrl,
          bookLink: currentFeaturedBook.bookLink || "",
        }

        // Add validation to ensure bookLink is properly formatted
        if (featuredBook.bookLink) {
          // Check if the bookLink contains placeholder text or is not a valid URL
          if (featuredBook.bookLink.includes("SINGLE_ITEM_ID") || !featuredBook.bookLink.startsWith("http")) {
            // If it's not valid, set it to a direct link to the book page using the book's ID
            featuredBook.bookLink = `/books/${currentFeaturedBook._id}`
          }
        } else {
          // If no bookLink is provided, default to the book's page
          featuredBook.bookLink = `/books/${currentFeaturedBook._id}`
        }
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    // Leave arrays as empty if there's an error and use fallback stats
    statsData = {
      booksCount: 16, // Fallback based on your CMS
      eventsCount: 9,
      reviewsCount: 85,
      galleryCount: 15,
    }
  }

  return (
    <ErrorBoundary>
      <HomePageClient
        initialGalleryItems={randomGalleryItems}
        upcomingEvents={upcomingEvents}
        testimonials={randomTestimonials}
        featuredBook={featuredBook}
        statsData={statsData}
      />
    </ErrorBoundary>
  )
}
