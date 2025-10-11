import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getServerClient } from "@/lib/wix"
import { convertWixEventData } from "@/lib/event-utils"
import { StatsHeader } from "@/components/stats/stats-header"
import { BookStatsSection } from "@/components/club-dashboard/book-stats-section"
import { EventStatsSection } from "@/components/club-dashboard/event-stats-section"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Define the IBook type
interface IBook {
  _id?: string
  title?: string
  author?: string
  genre?: string
  pageCount?: number
  rating?: number
  description?: string
  [key: string]: any
}

// Define the Review type
interface Review {
  _id: string
  bookId?: string
  rating?: number
  review?: string
  name?: string
  [key: string]: any
}

// Define the Event type
interface IEvent {
  _id: string
  title: string
  date: string
  time: string
  location: string
  type?: string
  description?: string
  moderators: string[]
  isPast?: boolean
  isOnline?: boolean
  image?: any
  [key: string]: any
}

async function getClubData() {
  try {
    const client = await getServerClient()

    // Fetch all books
    const booksResponse = await client.items.query("Books").find()

    // Fetch all reviews
    const reviewsResponse = await client.items.query("Reviews").find()

    // Fetch all events
    const eventsResponse = await client.items.query("Events").find()

    // Convert and filter events
    const events = eventsResponse.items
      .map((item) => convertWixEventData(item))
      .filter(
        (event: Partial<IEvent>): event is IEvent =>
          !!event &&
          typeof event._id === "string" &&
          typeof event.title === "string" &&
          typeof event.date === "string" &&
          typeof event.time === "string" &&
          typeof event.location === "string" &&
          Array.isArray(event.moderators) &&
          (event.description === undefined || typeof event.description === "string"),
      )

    // Process events to determine if they're online or physical
    const processedEvents = events.map((event) => {
      // Check if the location contains keywords that suggest an online event
      const isOnline =
        event.location.toLowerCase().includes("zoom") ||
        event.location.toLowerCase().includes("online") ||
        event.location.toLowerCase().includes("virtual") ||
        event.location.toLowerCase().includes("google meet") ||
        event.location.toLowerCase().includes("teams") ||
        event.location.toLowerCase().includes("webex") ||
        event.location.toLowerCase().includes("http") ||
        event.location.toLowerCase().includes("www.")

      return {
        ...event,
        isOnline,
      }
    })

    return {
      books: booksResponse.items.map((item) => item),
      reviews: reviewsResponse.items.map((item) => item),
      events: processedEvents,
    }
  } catch (error) {
    console.error("Error fetching club data:", error)
    return { books: [], reviews: [], events: [] }
  }
}

export default async function ClubDashboardPage() {
  const { books, reviews, events } = await getClubData()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1121] text-green-700 dark:text-green-500 overflow-x-hidden selection:bg-green-700/30">
      {/* Animated particles - visible in both light and dark modes */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-10 dark:opacity-20" />

      <div className="relative z-10">
        <StatsHeader />

        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <Tabs defaultValue="books" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-green-100/50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-1 rounded-lg backdrop-blur-sm">
              <TabsTrigger
                value="books"
                className="data-[state=active]:bg-green-700 data-[state=active]:text-white dark:data-[state=active]:bg-green-600 dark:data-[state=active]:text-white text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-all duration-200 font-medium"
              >
                Book Stats
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-green-700 data-[state=active]:text-white dark:data-[state=active]:bg-green-600 dark:data-[state=active]:text-white text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-all duration-200 font-medium"
              >
                Event Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="books">
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <BookStatsSection books={books} reviews={reviews} />
              </Suspense>
            </TabsContent>

            <TabsContent value="events">
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <EventStatsSection events={events} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
