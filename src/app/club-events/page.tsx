import { convertWixEventData, isEventHappeningToday } from "@/lib/event-utils"
import EventsClient from "@/app/club-events/events-client"
import { getServerClient } from "@/lib/wix"

type EventsPageProps = {
  searchParams?: Promise<{
    filter?: string
  }>
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  // Await params before using them
  const searchParamsObj = await searchParams
  const filter = searchParamsObj?.filter || "all"

  try {
    const client = await getServerClient()

    const response = await client.items.queryDataItems({ dataCollectionId: "Events" }).find()

    // Filter out any null or invalid event items to satisfy TypeScript
    let eventsData = response.items
      .map((item) => convertWixEventData(item.data || {}))
      .filter(
        (
          event,
        ): event is {
          date: string
          isPast?: boolean
          isHappeningToday?: boolean
          _id: string
          title: string
          time: string
          location: string
          moderators: string[]
          description: string
        } =>
          !!event &&
          typeof event.date === "string" &&
          typeof event._id === "string" &&
          typeof event.title === "string" &&
          typeof event.time === "string" &&
          typeof event.location === "string" &&
          Array.isArray(event.moderators) &&
          event.moderators.every((mod) => typeof mod === "string") &&
          typeof event.description === "string",
      )

    const currentDate = new Date()

    // Sort ALL events by date first (this ensures eventsData is also sorted)
    eventsData = eventsData.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      // Check if events are happening today, past, or upcoming
      const aIsToday = a.isHappeningToday || isEventHappeningToday(a.date)
      const bIsToday = b.isHappeningToday || isEventHappeningToday(b.date)
      const aIsPast = (dateA < currentDate || a.isPast) && !aIsToday
      const bIsPast = (dateB < currentDate || b.isPast) && !bIsToday

      // Priority order: Today events first, then upcoming, then past
      if (aIsToday && !bIsToday) return -1 // a is today, b is not, so a comes first
      if (!aIsToday && bIsToday) return 1 // b is today, a is not, so b comes first

      if (aIsPast && !bIsPast && !bIsToday) return 1 // a is past, b is upcoming, so b comes first
      if (!aIsPast && bIsPast && !aIsToday) return -1 // a is upcoming, b is past, so a comes first

      // If both are today, sort by time if available, otherwise by title
      if (aIsToday && bIsToday) {
        return a.title.localeCompare(b.title)
      }

      // If both are upcoming, sort by nearest first
      if (!aIsPast && !bIsPast && !aIsToday && !bIsToday) {
        return dateA.getTime() - dateB.getTime() // Ascending for upcoming
      }

      // If both are past, sort by most recent first
      if (aIsPast && bIsPast) {
        return dateB.getTime() - dateA.getTime() // Descending for past
      }

      return dateA.getTime() - dateB.getTime()
    })

    // Filter events into categories
    const happeningTodayEvents = eventsData.filter((event) => {
      return event.isHappeningToday || isEventHappeningToday(event.date)
    })

    const upcomingEvents = eventsData.filter((event) => {
      const eventDate = new Date(event.date)
      const isToday = event.isHappeningToday || isEventHappeningToday(event.date)
      return eventDate >= currentDate && !event.isPast && !isToday
    })

    const pastEvents = eventsData.filter((event) => {
      const eventDate = new Date(event.date)
      const isToday = event.isHappeningToday || isEventHappeningToday(event.date)
      return (eventDate < currentDate || event.isPast) && !isToday
    })

    return (
      <EventsClient
        eventsData={eventsData}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        happeningTodayEvents={happeningTodayEvents}
        filter={filter}
      />
    )
  } catch (error) {
    console.error("Error in events page:", error)

    return (
      <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Events</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We encountered an error while loading the events. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
