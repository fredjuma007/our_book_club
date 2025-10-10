"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/event-utils"
import Link from "next/link"

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const displayedEvents = events.slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-700/30 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6" />
        Upcoming Events
      </h2>

      {displayedEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 font-serif mb-4">No upcoming events</p>
          <Link href="/club-events">
            <Button
              variant="outline"
              size="sm"
              className="text-green-700 border-green-700 hover:bg-green-700 hover:text-white font-serif bg-transparent"
            >
              View All Events
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-700/30"
            >
              <h3 className="font-semibold text-green-800 dark:text-green-400 font-serif mb-2">{event.title}</h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {event.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </p>
              </div>
              {event.link ? (
                <Link href={event.link} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 text-green-700 border-green-700 hover:bg-green-700 hover:text-white font-serif bg-transparent"
                  >
                    Join Event
                  </Button>
                </Link>
              ) : (
                <Link href={`/club-events/${event._id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 text-green-700 border-green-700 hover:bg-green-700 hover:text-white font-serif bg-transparent"
                  >
                    View Details
                  </Button>
                </Link>
              )}
            </motion.div>
          ))}

          {events.length > 2 && (
            <Link href="/club-events">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-green-700 border-green-700 hover:bg-green-700 hover:text-white font-serif bg-transparent"
              >
                View All Events ({events.length})
              </Button>
            </Link>
          )}
        </div>
      )}
    </motion.div>
  )
}
