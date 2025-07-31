"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, Clock, ChevronDown, ChevronUp, BookOpen, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { isEventHappeningToday } from "@/lib/event-utils"

interface Event {
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
  date?: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function HeaderCountdown({
  upcomingEvent,
  fallbackEventTitle = "Book Club Meeting",
  fallbackEventTime = "7:00 PM - 9:00 PM",
  fallbackEventLink = "https://meet.google.com/vhv-hfwz-avi",
  fallbackBookTitle = "Sometimes I Lie",
  fallbackBookCover = "/sometimes i lie.jpg",
}: {
  upcomingEvent?: Event | null
  fallbackEventTitle?: string
  fallbackEventTime?: string
  fallbackEventLink?: string
  fallbackBookTitle?: string
  fallbackBookCover?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isHappeningToday, setIsHappeningToday] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use event data or fallbacks
  const eventTitle = upcomingEvent?.title || fallbackEventTitle
  const eventTime = upcomingEvent?.time || fallbackEventTime
  const bookTitle = upcomingEvent?.bookTitle || fallbackBookTitle
  const bookCover = upcomingEvent?.imageUrl || fallbackBookCover
  const eventId = upcomingEvent?.id || ""
  const eventLink = upcomingEvent?.link || fallbackEventLink || ""
  const eventDate = upcomingEvent?.date

  // Determine the link URL - use event page if we have an ID, otherwise use external link
  const linkUrl = eventId ? `/club-events/${eventId}` : eventLink || "#"

  // Determine if we should open in a new tab - only for external links
  const isExternalLink = !eventId && eventLink

  useEffect(() => {
    if (!eventDate) return

    // Check if event is happening today
    const todayCheck = isEventHappeningToday(eventDate.toISOString())
    setIsHappeningToday(todayCheck)

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const eventTime = eventDate.getTime()
      const difference = eventTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [eventDate])

  // Format countdown display
  const getCountdownDisplay = () => {
    if (isHappeningToday) {
      return "TODAY!"
    }

    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`
    } else if (timeLeft.minutes > 0) {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`
    } else if (timeLeft.seconds > 0) {
      return `${timeLeft.seconds}s`
    } else {
      return "Event Started"
    }
  }

  return (
    <div className="relative" ref={containerRef} style={{ zIndex: 999 }}>
      {/* Compact display with countdown */}
      <div className="flex items-center gap-1 cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="relative">
          {/* Pulsing effect - enhanced for "happening today" */}
          <div
            className={`absolute inset-0 rounded-full animate-pulse ${
              isHappeningToday ? "bg-gradient-to-r from-yellow-400/40 to-orange-500/40" : "bg-green-500/30"
            }`}
          />
          <div
            className={`relative text-white rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 ${
              isHappeningToday ? "bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse" : "bg-green-700"
            }`}
          >
            {isHappeningToday ? (
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            ) : (
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            )}
            <span>{getCountdownDisplay()}</span>
            {isHappeningToday && <Star className="w-2 h-2 fill-current animate-spin" />}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-green-700 dark:text-green-400 text-[10px] sm:text-xs font-serif">
          {isExpanded ? (
            <ChevronUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          ) : (
            <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          )}
        </div>
      </div>

      {/* Expanded dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 pointer-events-none z-[999]">
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute pointer-events-auto"
                style={{
                  top: containerRef.current ? containerRef.current.getBoundingClientRect().bottom + 8 : 0,
                  left: containerRef.current
                    ? Math.max(
                        10,
                        Math.min(containerRef.current.getBoundingClientRect().left - 200, window.innerWidth - 290),
                      )
                    : 0,
                  width: "280px",
                  maxWidth: "calc(100vw - 2rem)",
                  zIndex: 999,
                }}
              >
                <div
                  className={`rounded-xl shadow-xl border-2 overflow-hidden ${
                    isHappeningToday
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/90 dark:to-orange-900/90 border-yellow-400 backdrop-blur-md"
                      : "bg-[#fffaf0] dark:bg-gray-800/95 border-green-700 backdrop-blur-md"
                  }`}
                >
                  {/* Header */}
                  <div
                    className={`text-white p-3 flex justify-between items-center ${
                      isHappeningToday ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-green-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isHappeningToday ? <Zap className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      <h3 className="font-serif font-bold">
                        {isHappeningToday ? "Happening Today!" : "Upcoming Event"}
                      </h3>
                      {isHappeningToday && <Star className="w-4 h-4 fill-current animate-pulse" />}
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                      aria-label="Close"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Book info */}
                    <div className="flex gap-3 mb-3">
                      <div className="relative w-14 h-20 flex-shrink-0">
                        <Image
                          src={bookCover || "/placeholder.svg"}
                          alt={bookTitle}
                          fill
                          className={`object-cover rounded-md border ${
                            isHappeningToday ? "border-yellow-400" : "border-green-700"
                          }`}
                        />
                      </div>
                      <div>
                        <h4
                          className={`font-serif font-bold ${
                            isHappeningToday
                              ? "text-yellow-800 dark:text-yellow-400"
                              : "text-green-800 dark:text-green-400"
                          }`}
                        >
                          {eventTitle}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-serif">{bookTitle}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-600 dark:text-gray-300">
                          <Clock className={`w-3 h-3 ${isHappeningToday ? "text-yellow-600" : "text-green-700"}`} />
                          <span className={isHappeningToday ? "font-semibold" : ""}>{eventTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Countdown display */}
                    <div
                      className={`rounded-lg p-3 mb-3 ${
                        isHappeningToday
                          ? "bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-sm"
                          : "bg-green-700/15 backdrop-blur-sm"
                      }`}
                    >
                      {isHappeningToday ? (
                        <div className="text-center">
                          <p className="text-lg font-bold text-yellow-800 dark:text-yellow-400 font-serif animate-pulse">
                            🎉 EVENT IS TODAY! 🎉
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 font-serif mt-1">
                            Don't miss out!
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-center text-green-800 dark:text-green-400 mb-2 font-serif">
                            Time until event:
                          </p>
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-white/50 dark:bg-gray-700/50 rounded p-1">
                              <div className="text-lg font-bold text-green-800 dark:text-green-400">
                                {timeLeft.days}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">Days</div>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-700/50 rounded p-1">
                              <div className="text-lg font-bold text-green-800 dark:text-green-400">
                                {timeLeft.hours}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">Hours</div>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-700/50 rounded p-1">
                              <div className="text-lg font-bold text-green-800 dark:text-green-400">
                                {timeLeft.minutes}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">Min</div>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-700/50 rounded p-1">
                              <div className="text-lg font-bold text-green-800 dark:text-green-400">
                                {timeLeft.seconds}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">Sec</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Join button */}
                    <Button
                      asChild
                      className={`w-full text-white transition-all duration-300 font-serif relative overflow-hidden group/btn ${
                        isHappeningToday
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                          : "bg-green-700 hover:bg-green-800"
                      }`}
                      disabled={!linkUrl || linkUrl === "#"}
                    >
                      <Link
                        href={linkUrl}
                        target={isExternalLink ? "_blank" : undefined}
                        rel={isExternalLink ? "noopener noreferrer" : undefined}
                        onClick={() => setIsExpanded(false)}
                      >
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        {isHappeningToday ? <Zap className="w-4 h-4 mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />}
                        {isHappeningToday
                          ? "Join Now!"
                          : eventId
                            ? "View Event Details"
                            : eventLink
                              ? "Join Discussion"
                              : "Event Details"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
