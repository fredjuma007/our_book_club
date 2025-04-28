import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { getServerClient } from "@/lib/wix"
import { convertWixEventData } from "@/lib/event-utils"
import { StatsHeader } from "@/components/event-stats/stats-header"
import { StatsOverview } from "@/components/event-stats/stats-overview"
import { EventTypeDistribution } from "@/components/event-stats/event-type-distribution"
import { LocationTypeDistribution } from "@/components/event-stats/location-type-distribution"
import { EventTimeline } from "@/components/event-stats/event-timeline"
import { ModeratorStats } from "@/components/event-stats/moderator-stats"
import { AIEventSummary } from "@/components/event-stats/ai-event-summary"

export const dynamic = "force-dynamic"
export const revalidate = 0

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

async function getEventStats() {
  try {
    const client = await getServerClient()

    // Fetch all events
    const eventsResponse = await client.items
      .queryDataItems({
        dataCollectionId: "Events",
      })
      .find()

    // Convert and filter events
    const events = eventsResponse.items
      .map((item) => convertWixEventData(item.data || {}))
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

    return { events: processedEvents }
  } catch (error) {
    console.error("Error fetching event stats:", error)
    return { events: [] }
  }
}

export default async function ClubEventStatsPage() {
  const { events } = await getEventStats()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1121] text-green-700 dark:text-green-500 overflow-x-hidden selection:bg-green-700/30">
      {/* Animated particles - visible in both light and dark modes */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-10 dark:opacity-20" />

      <div className="relative z-10">
        <StatsHeader />

        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <StatsOverview events={events} />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <EventTypeDistribution events={events} />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <LocationTypeDistribution events={events} />
            </Suspense>
          </div>

          <div className="mt-12">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <EventTimeline events={events} />
            </Suspense>
          </div>

          <div className="mt-12">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <ModeratorStats events={events} />
            </Suspense>
          </div>

          <div className="mt-12 mb-16">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <AIEventSummary events={events} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
