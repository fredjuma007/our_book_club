"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import {
  BookOpen,
  MapPin,
  Clock,
  BookMarked,
  CalendarCheck,
  Sparkles,
  Info,
  History,
  Archive,
  Camera,
} from "lucide-react"
import Footer from "@/components/footer"
import { convertWixImageToUrl } from "@/lib/wix-client"
import type { Event } from "@/lib/event-utils"

interface EventsClientProps {
  eventsData: Event[]
  upcomingEvents: Event[]
  pastEvents: Event[]
  filter: string
}

export default function EventsClient({ eventsData, upcomingEvents, pastEvents, filter }: EventsClientProps) {
  // Determine which events to display based on filter
  let eventsToDisplay = eventsData
  let showPastEvents = true

  if (filter === "upcoming") {
    eventsToDisplay = upcomingEvents
    showPastEvents = false
  } else if (filter === "previous" || filter === "past") {
    eventsToDisplay = pastEvents
    showPastEvents = false
  }

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 selection:bg-green-700/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          {/* Floating Books */}
          <div className="absolute right-10 top-10 hidden lg:block animate-[bounce_6s_ease-in-out_infinite]">
            <BookOpen className="w-16 h-16 text-green-700/30 transform rotate-12" />
          </div>
          <div className="absolute left-20 bottom-10 hidden lg:block animate-[bounce_8s_ease-in-out_infinite]">
            <BookMarked className="w-12 h-12 text-green-700/20 transform -rotate-12" />
          </div>

          {/* Header Content */}
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 relative inline-block group">
              <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              Events📅
              <Sparkles className="absolute -right-8 -top-8 w-6 h-6 text-green-700/40 animate-spin-slow" />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Join us for exciting book discussions, workshops, and literary adventures!
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/club-events"
              className={`${
                filter === "all" ? "bg-green-700 text-white" : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CalendarCheck className="w-4 h-4 mr-2" />
              All Events
            </Link>
            <Link
              href="/club-events?filter=upcoming"
              className={`${
                filter === "upcoming" ? "bg-green-700 text-white" : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CalendarCheck className="w-4 h-4 mr-2" />
              Upcoming Events
            </Link>
            <Link
              href="/club-events?filter=previous"
              className={`${
                filter === "previous" ? "bg-green-700 text-white" : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <History className="w-4 h-4 mr-2" />
              Previous Events
            </Link>
            <Link
              href="/gallery"
              className="text-green-700 dark:text-white border border-green-700 hover:bg-green-200 font-serif relative overflow-hidden group px-4 py-2 rounded-md flex items-center"
            >
              <Camera className="w-4 h-4 mr-2" />
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="mr-2">Gallery</span>
            </Link>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16 relative">
        <div className="space-y-8">
          {filter === "upcoming" && (
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6 flex items-center">
              <CalendarCheck className="w-6 h-6 mr-2" />
              Upcoming Events
            </h2>
          )}

          {filter === "previous" && (
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6 flex items-center">
              <Archive className="w-6 h-6 mr-2" />
              Previous Events
            </h2>
          )}

          {eventsToDisplay.length > 0 ? (
            eventsToDisplay.map((event) => (
              <div key={event._id} className="group relative">
                {/* Event Card - Make the entire card clickable */}
                <Link href={`/club-events/${event._id}`} className="block">
                  <div className="relative bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image Section */}
                        <div className="relative w-full md:w-64 h-48 md:h-64 group">
                          <Image
                            src={
                              event.image ? convertWixImageToUrl(event.image) : "/placeholder.svg?height=300&width=200"
                            }
                            alt={event.title}
                            fill
                            className="rounded-lg object-cover border-2 border-green-700 transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
                          <div className="absolute bottom-2 left-2 bg-green-700/90 text-white px-3 py-1 rounded-full text-sm font-serif backdrop-blur-sm">
                            {event.type || "Event"}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                              {event.title}
                            </h3>
                            <div className="flex gap-2">
                              {event.link && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    window.open(event.link, "_blank", "noopener,noreferrer")
                                  }}
                                  className="h-9 bg-green-700 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group/btn"
                                >
                                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                  Join Discussion
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300 font-serif">
                            <div className="flex items-center gap-2 group/item">
                              <Clock className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-2 group/item">
                              <MapPin className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-2 group/item">
                              <CalendarCheck className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                              {new Date(event.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            {event.bookTitle && (
                              <div className="flex items-center gap-2 group/item">
                                <BookOpen className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                                {event.bookTitle}
                              </div>
                            )}
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 font-serif line-clamp-2">
                            {event.description}
                          </p>

                          {/* Moderators */}
                          {event.moderators && event.moderators.length > 0 && (
                            <div className="flex items-center gap-4">
                              <span className="text-green-800 dark:text-green-500 font-serif font-semibold">
                                Moderators:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {event.moderators.map((moderator, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-green-700/10 text-green-800 dark:text-green-500 px-3 py-1 rounded-full text-sm font-serif transition-all duration-300 hover:bg-green-700/20 hover:scale-105"
                                  >
                                    {moderator}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700">
              <Archive className="w-16 h-16 mx-auto text-green-700/50 mb-4" />
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-2">
                No {filter === "upcoming" ? "Upcoming" : filter === "previous" ? "Previous" : ""} Events
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
                {filter === "upcoming"
                  ? "Check back soon for new events or view our previous gatherings!"
                  : filter === "previous"
                    ? "No previous events found. Check out our upcoming events!"
                    : "No events found."}
              </p>
            </div>
          )}

          {/* Show past events section only on the "all" view */}
          {filter === "all" && pastEvents.length > 0 && showPastEvents && (
            <>
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mt-12 mb-6 flex items-center">
                <Archive className="w-6 h-6 mr-2" />
                Previous Events
              </h2>

              {pastEvents.map((event) => (
                <div key={event._id} className="group relative">
                  <Link href={`/club-events/${event._id}`} className="block">
                    <div className="relative bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700/70 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Image Section */}
                          <div className="relative w-full md:w-64 h-48 md:h-64 group">
                            <div className="absolute inset-0 bg-black/10 z-10 rounded-lg" />
                            <Image
                              src={
                                event.image
                                  ? convertWixImageToUrl(event.image)
                                  : "/placeholder.svg?height=300&width=200"
                              }
                              alt={event.title}
                              fill
                              className="rounded-lg object-cover border-2 border-green-700/70 transition-transform duration-300 group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
                            <div className="absolute bottom-2 left-2 bg-green-700/80 text-white px-3 py-1 rounded-full text-sm font-serif backdrop-blur-sm">
                              {event.type || "Event"}
                            </div>
                            <div className="absolute top-2 right-2 bg-gray-800/80 text-white px-3 py-1 rounded-full text-xs font-serif backdrop-blur-sm">
                              Past Event
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                {event.title}
                              </h3>
                            </div>

                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300 font-serif">
                              <div className="flex items-center gap-2 group/item">
                                <Clock className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-2 group/item">
                                <MapPin className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                                {event.location}
                              </div>
                              <div className="flex items-center gap-2 group/item">
                                <CalendarCheck className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                                {new Date(event.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                              {event.bookTitle && (
                                <div className="flex items-center gap-2 group/item">
                                  <BookOpen className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                                  {event.bookTitle}
                                </div>
                              )}
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 font-serif line-clamp-2">
                              {event.description}
                            </p>

                            {/* Moderators */}
                            {event.moderators && event.moderators.length > 0 && (
                              <div className="flex items-center gap-4">
                                <span className="text-green-800 dark:text-green-500 font-serif font-semibold">
                                  Moderators:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {event.moderators.map((moderator, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-green-700/10 text-green-800 dark:text-green-500 px-3 py-1 rounded-full text-sm font-serif transition-all duration-300 hover:bg-green-700/20 hover:scale-105"
                                    >
                                      {moderator}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12 space-y-6">
            <div className="relative inline-block">
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif">
                Want to know more? Maybe join us?
              </h3>
              <div className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 hover:scale-x-100 transition-transform origin-left" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Click the about us page below to learn more about the club and how to join.
            </p>
            <Link href="/about-us">
              <Button
                variant="outline"
                className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Info className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
        {/* Footer Section */}
    </div>
  )
}
