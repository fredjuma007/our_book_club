"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import React from "react"
import { motion } from "framer-motion"
import { BookOpen, MapPin, Clock, BookMarked, CalendarCheck, Sparkles, Info, History, Archive, CalendarDays, Camera } from "lucide-react"
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
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 selection:bg-green-700/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          {/* Floating Books */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute right-10 top-10 hidden lg:block animate-[bounce_6s_ease-in-out_infinite]"
          >
            <BookOpen className="w-16 h-16 text-green-700/30 transform rotate-12" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-20 bottom-10 hidden lg:block animate-[bounce_8s_ease-in-out_infinite]"
          >
            <BookMarked className="w-12 h-12 text-green-700/20 transform -rotate-12" />
          </motion.div>

          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 relative inline-block group">
              <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              Events & Gatherings 📅
              <Sparkles className="absolute -right-8 -top-8 w-6 h-6 text-green-700/40 animate-spin-slow" />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Join us for exciting book discussions, workshops, and literary adventures!
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
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CalendarCheck className="w-4 h-4 mr-2" />
              Upcoming Events
            </div>
            <div
              onClick={() => setActiveSection("previous")}
              className={`${
                activeSection === "previous"
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <History className="w-4 h-4 mr-2" />
              Previous Events
            </div>
            <div
              onClick={() => setActiveSection("calendar")}
              className={`${
                activeSection === "calendar"
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              Calendar View
            </div>

            <Link
              href="/gallery"
              className="text-green-700 dark:text-white border border-green-700 hover:bg-green-200 font-serif relative overflow-hidden group px-4 py-2 rounded-md flex items-center"
            >
              <Camera className="w-4 h-4 mr-2" />
              <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="mr-2">Gallery</span>
            </Link>
          </motion.div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
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
                  <div className="relative bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Image Section */}
                        <div className="relative w-full md:w-64 h-48 md:h-64 group">
                          <Image
                            src={event.imageUrl || "/placeholder.svg"}
                            alt={event.title}
                            fill
                            className="rounded-lg object-cover border-2 border-green-700 transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
                          <div className="absolute bottom-2 left-2 bg-green-700/90 text-white px-3 py-1 rounded-full text-sm font-serif backdrop-blur-sm">
                            {event.type}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                              {event.title}
                            </h3>
                            {event.link && (
                              <Button
                                variant="secondary"
                                className="bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
                              >
                                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                <Link href={event.link} target="_blank" rel="noopener noreferrer">
                                  Join Discussion
                                </Link>
                              </Button>
                            )}
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
                              {event.eventDate}
                            </div>
                            <div className="flex items-center gap-2 group/item">
                              <BookOpen className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                              {event.bookTitle}
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 font-serif">{event.description}</p>

                          {/* Moderators */}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700">
                <Archive className="w-16 h-16 mx-auto text-green-700/50 mb-4" />
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-serif">
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
            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-700 mb-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center">
                <Archive className="w-6 h-6 mr-2" />
                Previous Events
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
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
                <div className="relative bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700/70 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image Section */}
                      <div className="relative w-full md:w-64 h-48 md:h-64 group">
                        <div className="absolute inset-0 bg-black/10 z-10 rounded-lg" />
                        <Image
                          src={event.imageUrl || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="rounded-lg object-cover border-2 border-green-700/70 transition-transform duration-300 group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
                        <div className="absolute bottom-2 left-2 bg-green-700/80 text-white px-3 py-1 rounded-full text-sm font-serif backdrop-blur-sm">
                          {event.type}
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
                            {event.eventDate}
                          </div>
                          <div className="flex items-center gap-2 group/item">
                            <BookOpen className="w-5 h-5 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                            {event.bookTitle}
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 font-serif">{event.description}</p>

                        {/* Moderators */}
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
