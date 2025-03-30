"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import React from "react"
import { motion } from "framer-motion"
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
  CalendarDays,
  Camera,
  Star,
  BombIcon as Balloon,
} from "lucide-react"
import Footer from "@/components/footer"
import { events } from "@/data/events"
import { previousEvents } from "@/data/previous-events"

export default function EventsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [activeSection, setActiveSection] = React.useState<string>("upcoming")

  // Create a set of event dates for easy comparison
  const allEventDates = new Set([
    ...events.map((event) => event.date.toDateString()),
    ...previousEvents.map((event) => event.date.toDateString()),
  ])

  const modifiers = {
    highlighted: (day: Date) => allEventDates.has(day.toDateString()),
  }

  const modifiersClassNames = {
    highlighted: "bg-green-700 text-white rounded-full",
  }

  return (
    <div className="min-h-screen bg-[#f9f3ff] dark:bg-blueberry selection:bg-candy/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 star-bg animate-fade" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          {/* Floating Decorations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute right-10 top-10 hidden lg:block animate-float"
          >
            <BookOpen className="w-16 h-16 text-candy transform rotate-12" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-20 bottom-10 hidden lg:block animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <BookMarked className="w-16 h-16 text-sky transform -rotate-12" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute right-40 bottom-20 hidden lg:block animate-float"
            style={{ animationDelay: "1s" }}
          >
            <Balloon className="w-16 h-16 text-sunshine transform rotate-6" />
          </motion.div>

          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-blueberry dark:text-sky mb-4 relative inline-block group rainbow-text">
              <span className="absolute -inset-1 bg-candy/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              Events & Fun Times!
              <Sparkles className="absolute -right-8 -top-8 w-8 h-8 text-sunshine animate-spin-slow" />
            </h1>
            <p className="text-xl text-blueberry/80 dark:text-sky/80 max-w-2xl mx-auto">
              Join us for exciting book discussions, workshops, and magical reading adventures!
            </p>
          </motion.div>

          {/* Navigation Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <div
              onClick={() => setActiveSection("upcoming")}
              className={`${
                activeSection === "upcoming"
                  ? "bg-candy text-white shadow-childish"
                  : "text-blueberry dark:text-sky border-4 border-candy hover:bg-candy/20"
              } relative overflow-hidden group px-4 py-3 rounded-full cursor-pointer flex items-center font-bold`}
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CalendarCheck className="w-5 h-5 mr-2" />
              Upcoming Events
            </div>
            <div
              onClick={() => setActiveSection("previous")}
              className={`${
                activeSection === "previous"
                  ? "bg-sky text-white shadow-childish"
                  : "text-blueberry dark:text-sky border-4 border-sky hover:bg-sky/20"
              } relative overflow-hidden group px-4 py-3 rounded-full cursor-pointer flex items-center font-bold`}
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <History className="w-5 h-5 mr-2" />
              Previous Events
            </div>
            <div
              onClick={() => setActiveSection("calendar")}
              className={`${
                activeSection === "calendar"
                  ? "bg-sunshine text-blueberry shadow-childish"
                  : "text-blueberry dark:text-sunshine border-4 border-sunshine hover:bg-sunshine/20"
              } relative overflow-hidden group px-4 py-3 rounded-full cursor-pointer flex items-center font-bold`}
            >
              <CalendarDays className="w-5 h-5 mr-2" />
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              Calendar View
            </div>

            <Link
              href="/gallery"
              className="text-blueberry dark:text-sky border-4 border-grass hover:bg-grass/20 relative overflow-hidden group px-4 py-3 rounded-full flex items-center font-bold"
            >
              <Camera className="w-5 h-5 mr-2" />
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="mr-2">Gallery</span>
            </Link>
          </motion.div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-blueberry/80 transform -skew-y-2" />
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16 relative">
        {activeSection === "upcoming" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {events.length > 0 ? (
              events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Event Card */}
                  <div
                    className="relative bg-white dark:bg-blueberry/80 rounded-3xl shadow-childish hover:shadow-childish-lg border-4 border-candy overflow-hidden transition-all duration-300 hover:-translate-y-2 animate-float"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-candy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image Section */}
                        <div className="relative w-full md:w-64 h-48 md:h-64 group">
                          <Image
                            src={event.imageUrl || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="rounded-2xl object-cover border-4 border-sky transition-transform duration-300 group-hover:scale-105 shadow-childish"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-blueberry/40 to-transparent rounded-2xl" />
                          <div className="absolute bottom-3 left-3 bg-cherry text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm shadow-childish transform rotate-2">
                            {event.type}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <h3 className="text-2xl font-bold text-blueberry dark:text-sky group-hover:text-candy dark:group-hover:text-candy transition-colors">
                              {event.title}
                            </h3>
                            {event.link && (
                              <Button
                                variant="secondary"
                                className="bg-candy hover:bg-candy/80 text-white transition-all duration-300 relative overflow-hidden group/btn rounded-full shadow-childish"
                              >
                                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                <Link href={event.link} target="_blank" rel="noopener noreferrer">
                                  <Star className="w-4 h-4 mr-1 animate-spin-slow" />
                                  Join Discussion
                                </Link>
                              </Button>
                            )}
                          </div>

                          {/* Event Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blueberry/80 dark:text-sky/80">
                            <div className="flex items-center gap-2 group/item">
                              <Clock className="w-5 h-5 text-candy transition-transform duration-300 group-hover/item:scale-110" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-2 group/item">
                              <MapPin className="w-5 h-5 text-sky transition-transform duration-300 group-hover/item:scale-110" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-2 group/item">
                              <CalendarCheck className="w-5 h-5 text-sunshine transition-transform duration-300 group-hover/item:scale-110" />
                              {event.eventDate}
                            </div>
                            <div className="flex items-center gap-2 group/item">
                              <BookOpen className="w-5 h-5 text-grass transition-transform duration-300 group-hover/item:scale-110" />
                              {event.bookTitle}
                            </div>
                          </div>

                          <p className="text-blueberry/80 dark:text-sky/80 bg-white/50 dark:bg-blueberry/50 p-4 rounded-2xl border-2 border-dashed border-sky">
                            {event.description}
                          </p>

                          {/* Moderators */}
                          <div className="flex items-center gap-4">
                            <span className="text-blueberry dark:text-sky font-bold">Moderators:</span>
                            <div className="flex flex-wrap gap-2">
                              {event.moderators.map((moderator, idx) => (
                                <span
                                  key={idx}
                                  className="bg-sunshine/30 text-blueberry dark:text-sunshine px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-sunshine/50 hover:scale-105 shadow-childish"
                                >
                                  {moderator}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-blueberry/80 rounded-3xl shadow-childish border-4 border-candy">
                <Archive className="w-20 h-20 mx-auto text-candy/50 mb-4" />
                <h3 className="text-2xl font-bold text-blueberry dark:text-sky mb-2">No Upcoming Events</h3>
                <p className="text-blueberry/80 dark:text-sky/80">
                  Check back soon for new events or view our previous gatherings!
                </p>
              </div>
            )}

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12 space-y-6"
            >
              <div className="relative inline-block">
                <h3 className="text-2xl font-bold text-blueberry dark:text-sky rainbow-text">
                  Want to know more? Maybe join us?
                </h3>
                <div className="absolute -inset-1 bg-candy/10 rounded-lg scale-x-0 hover:scale-x-100 transition-transform origin-left" />
              </div>
              <p className="text-blueberry/80 dark:text-sky/80 max-w-2xl mx-auto">
                Click the about us page below to learn more about the club and how to join.
              </p>
              <Link href="/about-us">
                <Button
                  variant="outline"
                  className="border-4 border-sky text-blueberry dark:text-sky hover:bg-sky/20 group relative overflow-hidden rounded-full shadow-childish"
                >
                  <span className="absolute inset-0 bg-sky/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Info className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  About Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}

        {activeSection === "previous" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-blueberry/80 rounded-3xl p-6 shadow-childish border-4 border-sky mb-8">
              <h2 className="text-2xl font-bold text-blueberry dark:text-sky mb-4 flex items-center">
                <Archive className="w-7 h-7 mr-2 text-sky" />
                Previous Events
              </h2>
              <p className="text-blueberry/80 dark:text-sky/80">
                Explore our past gatherings and discussions. These events showcase our reading journey and community
                growth.
              </p>
            </div>

            {previousEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Event Card */}
                <div
                  className="relative bg-white dark:bg-blueberry/80 rounded-3xl shadow-childish hover:shadow-childish-lg border-4 border-sky/70 overflow-hidden transition-all duration-300 hover:-translate-y-2 animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image Section */}
                      <div className="relative w-full md:w-64 h-48 md:h-64 group">
                        <div className="absolute inset-0 bg-white/10 z-10 rounded-2xl" />
                        <Image
                          src={event.imageUrl || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="rounded-2xl object-cover border-4 border-sky/70 transition-transform duration-300 group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0 shadow-childish"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blueberry/40 to-transparent rounded-2xl" />
                        <div className="absolute bottom-3 left-3 bg-sky/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm shadow-childish transform rotate-2">
                          {event.type}
                        </div>
                        <div className="absolute top-3 right-3 bg-blueberry/80 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm shadow-childish transform -rotate-2">
                          Past Event
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="text-2xl font-bold text-blueberry dark:text-sky group-hover:text-sky dark:group-hover:text-sky transition-colors">
                            {event.title}
                          </h3>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blueberry/80 dark:text-sky/80">
                          <div className="flex items-center gap-2 group/item">
                            <Clock className="w-5 h-5 text-candy transition-transform duration-300 group-hover/item:scale-110" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2 group/item">
                            <MapPin className="w-5 h-5 text-sky transition-transform duration-300 group-hover/item:scale-110" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 group/item">
                            <CalendarCheck className="w-5 h-5 text-sunshine transition-transform duration-300 group-hover/item:scale-110" />
                            {event.eventDate}
                          </div>
                          <div className="flex items-center gap-2 group/item">
                            <BookOpen className="w-5 h-5 text-grass transition-transform duration-300 group-hover/item:scale-110" />
                            {event.bookTitle}
                          </div>
                        </div>

                        <p className="text-blueberry/80 dark:text-sky/80 bg-white/50 dark:bg-blueberry/50 p-4 rounded-2xl border-2 border-dashed border-sky">
                          {event.description}
                        </p>

                        {/* Moderators */}
                        <div className="flex items-center gap-4">
                          <span className="text-blueberry dark:text-sky font-bold">Moderators:</span>
                          <div className="flex flex-wrap gap-2">
                            {event.moderators.map((moderator, idx) => (
                              <span
                                key={idx}
                                className="bg-sunshine/30 text-blueberry dark:text-sunshine px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-sunshine/50 hover:scale-105 shadow-childish"
                              >
                                {moderator}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeSection === "calendar" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-6">Event Calendar</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((monthOffset) => (
                <motion.div
                  key={monthOffset}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: monthOffset * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-700/30 hover:border-green-700 transition-colors duration-300"
                >
                  <h3 className="text-center mb-4 text-green-700 dark:text-green-400 font-serif">
                    {new Date(new Date().setMonth(new Date().getMonth() + monthOffset)).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={new Date(new Date().setMonth(new Date().getMonth() + monthOffset))}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                    className="rounded-md border border-green-700 text-gray-800 dark:text-gray-200"
                  />
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm font-serif">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-700 animate-pulse" />
                <span className="text-gray-600 dark:text-gray-300">Event Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-green-700" />
                <span className="text-gray-600 dark:text-gray-300">No Events</span>
              </div>
            </div>

            {/* Selected Date Info */}
            {date && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 p-4 border border-green-700/30 rounded-lg bg-white/50 dark:bg-gray-800/50"
              >
                <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif mb-2">
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                {allEventDates.has(date.toDateString()) ? (
                  <div>
                    <p className="text-green-700 dark:text-green-400 font-serif mb-2">Events on this date:</p>
                    <ul className="space-y-2">
                      {[...events, ...previousEvents]
                        .filter((event) => event.date.toDateString() === date.toDateString())
                        .map((event) => (
                          <li key={event.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-700" />
                            <span className="font-serif">
                              {event.title} - {event.time}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 font-serif">No events scheduled for this date.</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  )
}
