"use client"

import { useState, useEffect } from "react"
import { BookOpen, Calendar, Clock, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type CountdownWidgetProps = {
  eventDate: Date
  eventTitle: string
  eventTime: string
  eventLink: string
  bookTitle: string
  bookCover: string
}

export function CountdownWidget({
  eventDate = new Date(2025, 2, 29, 19, 0, 0), // March 29, 2025, 7:00 PM
  eventTitle = "Book Club Meeting",
  eventTime = "7:00 PM - 9:00 PM",
  eventLink = "https://meet.google.com/vhv-hfwz-avi",
  bookTitle = "Sometimes I Lie",
  bookCover = "/sometimes i lie.jpg",
}: Partial<CountdownWidgetProps>) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Show widget after a delay
  useEffect(() => {
    const minimizedState = localStorage.getItem("countdownWidgetMinimized")
    if (minimizedState === "true") {
      setIsMinimized(true)
      setIsVisible(true)
    } else {
      // Show widget after a delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +eventDate - +new Date()

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
  }, [eventDate])

  const handleMinimize = () => {
    setIsMinimized(true)
    localStorage.setItem("countdownWidgetMinimized", "true")
  }

  const handleMaximize = () => {
    setIsMinimized(false)
    localStorage.setItem("countdownWidgetMinimized", "false")
  }

  // Don't render if countdown is over
  if (!timeLeft) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {isMinimized ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={handleMaximize}
              className="fixed bottom-4 right-4 z-50 cursor-pointer"
            >
              <div className="relative">
                {/* Pulsing ring animation */}
                <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />

                {/* Main bubble */}
                <div className="relative w-14 h-14 bg-green-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 hover:bg-green-800 transition-colors">
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {timeLeft.days}
                  </div>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 100, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed bottom-4 right-4 z-50 max-w-sm w-full md:w-80 shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="bg-[#fffaf0] dark:bg-gray-800/95 border-2 border-green-700 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-green-700 text-white p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <h3 className="font-serif font-bold">Upcoming Event</h3>
                  </div>
                  <button
                    onClick={handleMinimize}
                    className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    aria-label="Minimize"
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

                  {/* Countdown */}
                  <div className="bg-green-700/10 rounded-lg p-3 mb-3">
                    <p className="text-xs text-center text-green-800 dark:text-green-400 mb-2 font-serif">
                      Time remaining until discussion:
                    </p>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      {Object.entries(timeLeft).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <div className="bg-green-700 text-white rounded-md py-1 px-2 font-mono text-lg font-bold">
                            {value.toString().padStart(2, "0")}
                          </div>
                          <span className="text-xs mt-1 text-gray-600 dark:text-gray-300 capitalize">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Join button */}
                  <Button
                    asChild
                    className="w-full bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
                  >
                    <Link href={eventLink} target="_blank" rel="noopener noreferrer">
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      <BookOpen className="w-4 h-4 mr-2" />
                      Join Discussion
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

