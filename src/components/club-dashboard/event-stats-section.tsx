import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsOverview } from "@/components/event-stats/stats-overview"
import { EventTypeDistribution } from "@/components/event-stats/event-type-distribution"
import { LocationTypeDistribution } from "@/components/event-stats/location-type-distribution"
import { EventTimeline } from "@/components/event-stats/event-timeline"
import { ModeratorStats } from "@/components/event-stats/moderator-stats"

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

interface EventStatsSectionProps {
  events: IEvent[]
}

export function EventStatsSection({ events }: EventStatsSectionProps) {
  return (
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
            {/* AI-generated insights*/}
        </Suspense>
      </div>
    </div>
  )
}
