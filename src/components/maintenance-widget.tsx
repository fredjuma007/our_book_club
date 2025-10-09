import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { convertWixEventData } from "@/lib/event-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export async function MaintenanceWidget() {
  let featuredBook: {
    title: string
    author: string
    coverImage: string
    meetingDate: string
  } | null = null

  let upcomingEvent: {
    title: string
    eventDate: string
    time: string
    location: string
    bookTitle: string
  } | null = null

  try {
    const client = await getServerClient()
    const currentDate = new Date()

    // Fetch featured book
    const featuredBookData = await client.items
      .query("FeaturedBooks")
      .find()
      .then((res) => res.items)
      .catch(() => [])

    if (featuredBookData && featuredBookData.length > 0) {
      const sortedBooks = featuredBookData.sort((a: any, b: any) => {
        if (a.isBookOfMonth && !b.isBookOfMonth) return -1
        if (!a.isBookOfMonth && b.isBookOfMonth) return 1
        const dateA = new Date(a.meetingDate || "")
        const dateB = new Date(b.meetingDate || "")
        return dateB.getTime() - dateA.getTime()
      })

      const currentBook = sortedBooks[0]
      if (currentBook) {
        let coverImageUrl = "/placeholder.svg?height=200&width=150"
        try {
          if (currentBook.coverImage) {
            coverImageUrl = convertWixImageToUrl(currentBook.coverImage)
          }
        } catch (error) {
          console.error("Error converting cover image:", error)
        }

        let formattedDate = ""
        try {
          if (currentBook.meetingDate) {
            const meetingDate = new Date(currentBook.meetingDate)
            formattedDate = meetingDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          }
        } catch (error) {
          console.error("Error formatting date:", error)
        }

        featuredBook = {
          title: currentBook.title || "",
          author: currentBook.author || "",
          coverImage: coverImageUrl,
          meetingDate: formattedDate,
        }
      }
    }

    // Fetch upcoming event
    const eventsData = await client.items
      .query("Events")
      .find()
      .then((res) => res.items)
      .catch(() => [])

    const processedEvents = eventsData
      .map((item: any) => convertWixEventData(item))
      .filter((event: any) => {
        if (!event) return false
        const eventDate = new Date(event.date)
        return eventDate >= currentDate && !event.isPast
      })

    processedEvents.sort((a: any, b: any) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    if (processedEvents.length > 0) {
      const nextEvent = processedEvents[0]
      const eventDate = new Date(nextEvent.date)
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      upcomingEvent = {
        title: nextEvent.title,
        eventDate: formattedDate,
        time: nextEvent.time,
        location: nextEvent.location,
        bookTitle: nextEvent.bookTitle || "TBA",
      }
    }
  } catch (error) {
    console.error("Error fetching maintenance widget data:", error)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pt-8 overflow-y-auto">
      <div className="container max-w-6xl my-4 md:my-8">
        <Card className="border-2 border-green-600/30 dark:border-green-400/30 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
          <CardHeader className="text-center space-y-4 pb-6 py-6 md:py-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 p-6 md:p-8 shadow-lg">
                <div className="relative w-20 h-20 md:w-24 md:h-24 animate-pulse">
                  <Image
                    src="/logo.jpg"
                    alt="The Reading Circle 254"
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent px-4 leading-tight">
                Website Under Maintenance
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-3 text-gray-600 dark:text-gray-300 px-4 leading-relaxed">
                We're currently updating our website to serve you better. Please check back soon!
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Book of the Month and Upcoming Event */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Book of the Month */}
              {featuredBook && (
                <Card className="border-2 border-green-600/20 dark:border-green-400/20 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-600/10 dark:bg-green-400/10">
                        {/* BookOpen icon remains unchanged */}
                        <svg
                          className="w-5 h-5 text-green-700 dark:text-green-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M18 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6z" />
                        </svg>
                      </div>
                      <CardTitle className="text-xl text-green-800 dark:text-green-300">Book of the Month</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative group">
                        <Image
                          src={featuredBook.coverImage || "/placeholder.svg"}
                          alt={featuredBook.title}
                          width={150}
                          height={225}
                          className="rounded-lg object-cover shadow-lg ring-2 ring-green-600/20 dark:ring-green-400/20 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight">
                          {featuredBook.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">by {featuredBook.author}</p>
                        {featuredBook.meetingDate && (
                          <Badge className="mt-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white border-0">
                            <svg
                              className="w-3 h-3 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Meeting: {featuredBook.meetingDate}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Event */}
              {upcomingEvent && (
                <Card className="border-2 border-green-600/20 dark:border-green-400/20 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-600/10 dark:bg-green-400/10">
                        {/* Calendar icon remains unchanged */}
                        <svg
                          className="w-5 h-5 text-green-700 dark:text-green-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <CardTitle className="text-xl text-green-800 dark:text-green-300">Upcoming Event</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">{upcomingEvent.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="font-semibold text-green-700 dark:text-green-400">Book:</span>{" "}
                        {upcomingEvent.bookTitle}
                      </p>
                    </div>
                    <div className="space-y-3 text-sm bg-white/50 dark:bg-gray-900/30 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-green-700 dark:text-green-400 min-w-fit">Date:</span>
                        <span className="text-gray-700 dark:text-gray-300">{upcomingEvent.eventDate}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-green-700 dark:text-green-400 min-w-fit">Time:</span>
                        <span className="text-gray-700 dark:text-gray-300">{upcomingEvent.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-green-700 dark:text-green-400 min-w-fit">Location:</span>
                        <span className="text-gray-700 dark:text-gray-300">{upcomingEvent.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Social Media Links */}
            <div className="text-center space-y-4 pt-6 border-t border-green-600/20 dark:border-green-400/20">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stay connected with us</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-green-600 text-green-700 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] dark:border-green-400 dark:text-green-400 transition-all duration-300 shadow-md hover:shadow-lg bg-transparent"
                  asChild
                >
                  <Link href="https://www.instagram.com/thereadingcircle254/" target="_blank" rel="noopener noreferrer">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M22 4.57a2.83 2.83 0 0 0-1.79.57h-.17a2.83 2.83 0 0 0-2.58 2.58V15a2.83 2.83 0 0 1-2.83 2.83a2.83 2.83 0 0 1-2.83-2.83V9.34a2.83 2.83 0 0 0-2.58-2.79h-.17a2.83 2.83 0 0 0-1.79.57L12 19.57l10-15z" />
                    </svg>
                    Instagram
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-green-600 text-green-700 hover:bg-black hover:text-white hover:border-black dark:border-green-400 dark:text-green-400 transition-all duration-300 shadow-md hover:shadow-lg bg-transparent"
                  asChild
                >
                  <Link href="https://www.tiktok.com/@thereadingcircle254" target="_blank" rel="noopener noreferrer">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    TikTok
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-green-600 text-green-700 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] dark:border-green-400 dark:text-green-400 transition-all duration-300 shadow-md hover:shadow-lg bg-transparent"
                  asChild
                >
                  <Link href="https://www.youtube.com/@TheReadingCircle254" target="_blank" rel="noopener noreferrer">
                    <svg
                      className="w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23 12l-5-11v22l5-11zm-11-9L0 12l5 11v-22z" />
                    </svg>
                    YouTube
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium italic pt-2">
                Get lost in a good book 📚
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
