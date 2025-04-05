"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, Clock, ChevronDown, ChevronUp, BookOpen, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { events } from "@/data/events" // Import events data

type HeaderCountdownProps = {
  eventDate: Date
  eventTitle: string
  eventTime: string
  eventLink: string
  bookTitle: string
  bookCover: string
}

export function HeaderCountdown({
  initialEventDate = new Date(2025, 2, 29, 19, 0, 0), // March 29, 2025, 7:00 PM
  initialEventTitle = "Book Club Meeting",
  initialEventTime = "7:00 PM - 9:00 PM",
  initialEventLink = "https://meet.google.com/vhv-hfwz-avi",
  initialBookTitle = "Sometimes I Lie",
  initialBookCover = "/sometimes i lie.jpg",
}: {
  initialEventDate?: Date
  initialEventTitle?: string
  initialEventTime?: string
  initialEventLink?: string
  initialBookTitle?: string
  initialBookCover?: string
}) {
  // State for current event details
  const [currentEvent, setCurrentEvent] = useState({
    eventDate: initialEventDate,
    eventTitle: initialEventTitle,
    eventTime: initialEventTime,
    eventLink: initialEventLink || "",
    bookTitle: initialBookTitle,
    bookCover: initialBookCover,
  })

  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Find the next upcoming event
  useEffect(() => {
    const findNextEvent = () => {
      const now = new Date()

      // Sort events by date
      const sortedEvents = [...events].sort((a, b) => +a.date - +b.date)

      // Find the next upcoming event
      const nextEvent = sortedEvents.find((event) => +event.date > +now)

      if (nextEvent) {
        setCurrentEvent({
          eventDate: nextEvent.date,
          eventTitle: nextEvent.title,
          eventTime: nextEvent.time,
          eventLink: nextEvent.link || "",
          bookTitle: nextEvent.bookTitle,
          bookCover: nextEvent.imageUrl || "/placeholder.svg",
        })
      }
    }

    // Find next event initially
    findNextEvent()

    // Check for next event when current one expires
    const checkInterval = setInterval(() => {
      if (!timeLeft) {
        findNextEvent()
      }
    }, 60000) // Check every minute

    return () => clearInterval(checkInterval)
  }, [timeLeft])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +currentEvent.eventDate - +new Date()

      if (difference <= 0) {
        // Event has passed
        return null
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft()
      setTimeLeft(timeLeft)

      // Clear interval when countdown is over
      if (!timeLeft) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [currentEvent.eventDate])

  // Don't render if no upcoming events
  if (!timeLeft && events.every((event) => +event.date < +new Date())) {
    return null
  }

  return (
    <div className="relative" ref={containerRef} style={{ zIndex: 999 }}>
      {/* Compact countdown display */}
      <div className="flex items-center gap-1 cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="relative">
          {/* Pulsing effect */}
          <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse" />
          <div className="relative bg-candy text-white rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-childish animate-pulse">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{timeLeft?.days || 0}d</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-candy dark:text-candy text-[10px] sm:text-xs">
          <span>Next Event</span>
          {isExpanded ? (
            <ChevronUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          ) : (
            <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          )}
        </div>
      </div>

      {/* Expanded dropdown - Portal to body to avoid z-index issues */}
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
                    : 0, // Ensure it stays within viewport
                  width: "280px",
                  maxWidth: "calc(100vw - 2rem)",
                  zIndex: 999,
                }}
              >
                <div className="bg-[#fffaf0] dark:bg-blueberry/95 rounded-3xl shadow-childish-lg border-4 border-candy animate-rainbow-border overflow-hidden">
                  {/* Header */}
                  <div className="bg-candy text-white p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <h3 className="font-serif font-bold">Upcoming Event</h3>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shadow-childish"
                      aria-label="Close"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Book info */}
                    <div className="flex gap-3 mb-3">
                      <div className="relative w-14 h-20 flex-shrink-0 animate-float">
                        <Image
                          src={currentEvent.bookCover || "/placeholder.svg"}
                          alt={currentEvent.bookTitle}
                          fill
                          className="object-cover rounded-xl border-4 border-sky shadow-childish"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-blueberry dark:text-sky">{currentEvent.eventTitle}</h4>
                        <p className="text-sm text-blueberry/80 dark:text-sky/80">{currentEvent.bookTitle}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-600 dark:text-gray-300">
                          <Clock className="w-3 h-3 text-candy" />
                          <span className="text-blueberry/80 dark:text-sky/80">{currentEvent.eventTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Countdown */}
                    {timeLeft && (
                      <div className="bg-sunshine/20 rounded-2xl p-3 mb-3 border-2 border-dashed border-sky">
                        <p className="text-xs text-center text-blueberry dark:text-sky mb-2">
                          Time remaining until discussion:
                        </p>
                        <div className="grid grid-cols-4 gap-1 text-center">
                          {Object.entries(timeLeft).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <div className="bg-candy text-white rounded-md py-0.5 sm:py-1 px-1 sm:px-2 text-sm sm:text-lg font-bold shadow-childish">
                                {value.toString().padStart(2, "0")}
                              </div>
                              <span className="text-[10px] sm:text-xs mt-1 text-blueberry/80 dark:text-sky/80 capitalize">
                                {key}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Join button */}
                    <Button
                      asChild
                      className="w-full bg-candy hover:bg-candy/80 text-white transition-all duration-300 relative overflow-hidden group/btn rounded-full shadow-childish"
                      disabled={!currentEvent.eventLink}
                    >

                      {/*<Link href={currentEvent.eventLink || "#"} target="_blank" rel="noopener noreferrer">
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        <BookOpen className="w-4 h-4 mr-2" />
                        {currentEvent.eventLink ? "Join Discussion" : "Event Details"}
                      </Link>*/}

                        <Link
                          href="/special-event"
                        >
                          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                          <Heart className="w-5 h-5 mr-2 animate-pulse" />
                            Donate
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
