"use client"

import { useState, useRef } from "react"
import { Calendar, Clock, ChevronDown, ChevronUp, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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
  // Extremely simplified - no countdown state, no useEffect
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use event data or fallbacks
  const eventTitle = upcomingEvent?.title || fallbackEventTitle
  const eventTime = upcomingEvent?.time || fallbackEventTime
  const bookTitle = upcomingEvent?.bookTitle || fallbackBookTitle
  const bookCover = upcomingEvent?.imageUrl || fallbackBookCover
  const eventId = upcomingEvent?.id || ""
  const eventLink = upcomingEvent?.link || fallbackEventLink || ""

  // Determine the link URL - use event page if we have an ID, otherwise use external link
  const linkUrl = eventId ? `/club-events/${eventId}` : eventLink || "#"

  // Determine if we should open in a new tab - only for external links
  const isExternalLink = !eventId && eventLink

  return (
    <div className="relative" ref={containerRef} style={{ zIndex: 999 }}>
      {/* Compact display - no countdown, just an icon */}
      <div className="flex items-center gap-1 cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="relative">
          {/* Pulsing effect */}
          <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse" />
          <div className="relative bg-green-700 text-white rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>Event</span>
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
                <div className="bg-[#fffaf0] dark:bg-gray-800/95 rounded-xl shadow-xl border-2 border-green-700 overflow-hidden">
                  {/* Header */}
                  <div className="bg-green-700 text-white p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <h3 className="font-serif font-bold">Upcoming Event</h3>
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
                          className="object-cover rounded-md border border-green-700"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-green-800 dark:text-green-400">{eventTitle}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-serif">{bookTitle}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-600 dark:text-gray-300">
                          <Clock className="w-3 h-3 text-green-700" />
                          <span>{eventTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Static event date display instead of countdown */}
                    <div className="bg-green-700/10 rounded-lg p-3 mb-3">
                      <p className="text-xs text-center text-green-800 dark:text-green-400 mb-2 font-serif">
                        {upcomingEvent?.eventDate || "Upcoming Event"}
                      </p>
                    </div>

                    {/* Join button */}
                    <Button
                      asChild
                      className="w-full bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
                      disabled={!linkUrl || linkUrl === "#"}
                    >
                      <Link
                        href={linkUrl}
                        target={isExternalLink ? "_blank" : undefined}
                        rel={isExternalLink ? "noopener noreferrer" : undefined}
                        onClick={() => setIsExpanded(false)}
                      >
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        <BookOpen className="w-4 h-4 mr-2" />
                        {eventId ? "View Event Details" : eventLink ? "Join Discussion" : "Event Details"}
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
