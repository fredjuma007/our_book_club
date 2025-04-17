import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, MapPin, CalendarCheck, Users, Tag, ChevronLeft } from "lucide-react"
import Footer from "@/components/footer"
import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { notFound } from "next/navigation"

import { convertWixEventData, formatEventDate, isEventPast } from "@/lib/event-utils"
import ShareButton from "@/components/sharebutton"

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  // Await params before using them
  const paramsObj = await params
  const eventId = paramsObj.eventId

  console.log(`Fetching event with ID: ${eventId}`)

  try {
    const client = await getServerClient()

    // Use getDataItem directly with the event ID instead of querying with a filter
    const eventResponse = await client.items.getDataItem(eventId, {
      dataCollectionId: "Events",
    })

    if (!eventResponse || !eventResponse.data) {
      console.log(`Event with ID ${eventId} not found`)
      return notFound()
    }

    const eventData = convertWixEventData(eventResponse.data || {})

    console.log(`Event found: ${eventData.title}`)

    // Format the date
    const formattedDate = formatEventDate(eventData.date)

    // Check if it's a past event
    const isPastEvent = isEventPast(eventData.date) || eventData.isPast

    return (
      <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 selection:bg-green-700/30">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

          <div className="max-w-screen-xl mx-auto py-8 px-4 lg:px-8 relative">
          <div className="mb-8">
              <Button
                variant="outline"
                className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group relative overflow-hidden"
                asChild
              >
                <Link href="/club-events" className="flex items-center">
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ChevronLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
                  All Events
                </Link>
              </Button>
            </div>

            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 overflow-hidden">
              {/* Event Header */}
              <div className="relative h-64 md:h-96">
                <Image
                  src={
                    eventData.image ? convertWixImageToUrl(eventData.image) : "/placeholder.svg?height=600&width=1200"
                  }
                  alt={eventData.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Event Type Badge */}
                <div className="absolute top-4 left-4 bg-green-700/90 text-white px-3 py-1 rounded-full text-sm font-serif backdrop-blur-sm">
                  {eventData.type || "Event"}
                </div>

                {/* Past Event Badge */}
                {isPastEvent && (
                  <div className="absolute top-4 right-4 bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm font-serif backdrop-blur-sm">
                    Past Event
                  </div>
                )}

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-2">{eventData.title}</h1>
                  <p className="text-white/80 font-serif text-lg">{formattedDate}</p>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Main Content */}
                  <div className="flex-1 space-y-6">
                    <div className="prose prose-green dark:prose-invert max-w-none font-serif">
                      <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif">
                        About this Event
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{eventData.description}</p>

                      {/* Book Information */}
                      {eventData.bookTitle && (
                        <div className="mt-8">
                          <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif mb-4">
                            Featured Book
                          </h3>
                          <div className="flex items-center gap-4 bg-green-700/10 p-4 rounded-lg">
                            <BookOpen className="w-8 h-8 text-green-700" />
                            <div>
                              <p className="font-bold text-green-800 dark:text-green-500">{eventData.bookTitle}</p>
                              {eventData.bookAuthor && (
                                <p className="text-gray-600 dark:text-gray-400">by {eventData.bookAuthor}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Content */}
                      {eventData.additionalContent && (
                        <div className="mt-8">
                          <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif mb-4">
                            Additional Information
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                            {eventData.additionalContent}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Moderators */}
                    {eventData.moderators && eventData.moderators.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Moderators
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {eventData.moderators.map((moderator, idx) => (
                            <span
                              key={idx}
                              className="bg-green-700/10 text-green-800 dark:text-green-500 px-4 py-2 rounded-full text-sm font-serif transition-all duration-300 hover:bg-green-700/20 hover:scale-105"
                            >
                              {moderator}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {eventData.tags && eventData.tags.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center">
                          <Tag className="w-5 h-5 mr-2" />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {eventData.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-green-700/10 text-green-800 dark:text-green-500 px-3 py-1 rounded-full text-sm font-serif transition-all duration-300 hover:bg-green-700/20 hover:scale-105"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="md:w-80 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-700/30 p-6 space-y-4">
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif mb-2">
                        Event Details
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CalendarCheck className="w-5 h-5 text-green-700 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Date & Time</p>
                            <p className="text-gray-600 dark:text-gray-400">{formattedDate}</p>
                            <p className="text-gray-600 dark:text-gray-400">{eventData.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-green-700 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Location</p>
                            <p className="text-gray-600 dark:text-gray-400">{eventData.location}</p>
                          </div>
                        </div>

                        {eventData.link && (
                          <div className="w-full">
                            <Link
                              href={eventData.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block w-full"
                            >
                              <Button className="w-full bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif">
                                Join Discussion
                              </Button>
                            </Link>
                          </div>
                        )}

                        <ShareButton />
                      </div>
                    </div>

                    {/* Related Events */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-700/30 p-6">
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif mb-4">
                        Explore More
                      </h3>
                      <div className="space-y-2">
                        <Link
                          href="/club-events"
                          className="block text-green-700 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 font-serif"
                        >
                          All Events
                        </Link>
                        <Link
                          href="/books"
                          className="block text-green-700 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 font-serif"
                        >
                          Book Collection
                        </Link>
                        <Link
                          href="/gallery"
                          className="block text-green-700 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 font-serif"
                        >
                          Gallery
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error in event page:", error)
    return notFound()
  }
}
