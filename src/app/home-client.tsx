"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  BookOpen,
  Calendar,
  ImagePlay,
  Quote,
  Sparkles,
  ChevronDown,
  ChevronRight,
  X,
  Star,
  ArrowRight,
  Clock,
  MapPin,
  CalendarCheck,
  Heart,
  Smile,
  MessageSquare,
  BookMarked,
  Users,
} from "lucide-react"
import React, { useEffect, useState, useRef } from "react"
import GladwellAIWidget from "@/components/gladwell-ai-widget"
import GladwellButton from "@/components/gladwell-button"
import { ClubStatsButton } from "@/components/club-stats-button"
import { ClubEventStatsButton } from "@/components/club-event-stats-button"

// Define the GalleryItem type
interface GalleryItem {
  id: string
  title: string
  caption: string
  src: string
  isVideo?: boolean
  date?: string
  category?: string
}

// Define the Event type
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
}

// Define the Testimonial type
interface Testimonial {
  id: string
  title: string
  role: string
  quote: string
  avatar: string
}

// Define the FeaturedBook type
interface FeaturedBook {
  id: string
  title: string
  author: string
  quote: string
  description: string
  meetingDate: string
  meetingLink: string
  coverImage: string
  bookLink?: string
}

// Define the StatsData type
interface StatsData {
  booksCount: number
  eventsCount: number
  reviewsCount: number
  galleryCount: number
}

interface HomePageClientProps {
  initialGalleryItems: GalleryItem[]
  upcomingEvents: Event[]
  testimonials?: Testimonial[]
  featuredBook?: FeaturedBook | null
  statsData: StatsData
}

export default function HomePageClient({
  initialGalleryItems = [],
  upcomingEvents = [],
  testimonials = [],
  featuredBook = null,
  statsData,
}: HomePageClientProps) {
  // Add state for controlling the AI widget
  const [isOpen, setIsOpen] = useState(false)
  const [showAbout, setShowAbout] = React.useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [showMobileBookDetails, setShowMobileBookDetails] = useState(false)

  // State for gallery items
  const [randomGalleryItems, setRandomGalleryItems] = useState<GalleryItem[]>(initialGalleryItems)
  const [isLoading, setIsLoading] = useState(initialGalleryItems.length === 0)

  // Refs for parallax effect
  const parallaxRef = useRef<HTMLDivElement>(null)
  const bookCoverRef = useRef<HTMLDivElement>(null)

  // State for particles
  const [particles, setParticles] = useState<React.ReactNode[]>([])

  // Fetch gallery items from API only if we don't have initial items
  useEffect(() => {
    async function fetchGalleryItems() {
      // If we already have items from the server, don't fetch again
      if (initialGalleryItems.length > 0) {
        setRandomGalleryItems(initialGalleryItems)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch("/api/gallery-preview")
        if (!response.ok) {
          throw new Error("Failed to fetch gallery preview")
        }
        const data = await response.json()
        setRandomGalleryItems(data)
      } catch (error) {
        console.error("Error fetching gallery preview:", error)
        setRandomGalleryItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleryItems()
  }, [initialGalleryItems])

  // Handle scroll and set active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "events", "testimonials"]
      const scrollPosition = window.scrollY + 200

      // Parallax effect
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.1}px)`
      }

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mouse move effect for book cover
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bookCoverRef.current) {
        const { left, top, width, height } = bookCoverRef.current.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5

        // Make the 3D effect much more subtle
        bookCoverRef.current.style.transform = `
          perspective(1000px)
          rotateY(${x * 3}deg)
          rotateX(${y * -3}deg)
          translateZ(5px)
        `
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  // Client-side only particle generation
  useEffect(() => {
    // Generate particles only on the client side
    const generateParticles = () => {
      const newParticles = []
      const particleCount = 10

      for (let i = 0; i < particleCount; i++) {
        const size = 20 + ((i * 2) % 15) // More deterministic size
        const left = (i * 10) % 100 // More deterministic position
        const top = (i * 8) % 100 // More deterministic position
        const delay = i * 0.5 // More deterministic delay
        const opacity = 0.05 + (i % 5) * 0.03 // More deterministic opacity

        newParticles.push(
          <div
            key={i}
            className="particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              opacity: opacity,
              animationDelay: `${delay}s`,
            }}
          />,
        )
      }
      setParticles(newParticles)
    }

    generateParticles()
  }, [])

  return (
    <div className="relative bg-[url('/karara.JPG')] bg-cover bg-fixed bg-center bg-no-repeat text-green-600 dark:text-green-500 overflow-x-hidden selection:bg-green-700/30">
      {isOpen && <GladwellAIWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      {/* Animated particles */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20 animate-fade" />

      {/* Main overlay */}
      <div className="fixed inset-0 bg-[#f5f0e1]/90 dark:bg-black/70 backdrop-blur-sm animated-bg" />

      {/* Floating particles - always render the container for consistent DOM structure */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {typeof window !== "undefined" && particles}
      </div>

      {/* Navigation dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {["hero", "features", "events", "testimonials"].map((section, index) => (
          <motion.button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              activeSection === section
                ? "bg-green-600 scale-125 animate-pulse-slow"
                : "bg-green-300 hover:bg-green-400"
            }`}
            aria-label={`Scroll to ${section} section`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Mobile Book Details Modal */}
      {showMobileBookDetails && featuredBook && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800/95 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="p-4 relative">
              <motion.button
                onClick={() => setShowMobileBookDetails(false)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-700/10 flex items-center justify-center text-green-700 hover:bg-green-700/20 transition-colors"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              <div className="flex items-start gap-4 mb-4">
                <Link
                  href={
                    featuredBook.bookLink && !featuredBook.bookLink.includes("SINGLE_ITEM_ID")
                      ? featuredBook.bookLink
                      : `/books/${featuredBook.id}`
                  }
                  className="relative w-16 h-24 flex-shrink-0 group/cover"
                >
                  <Image
                    src={featuredBook.coverImage || "/placeholder.svg"}
                    alt={`${featuredBook.title} Book Cover`}
                    fill
                    className="rounded-lg shadow-lg object-cover transition-transform duration-300 group-hover/cover:scale-105 group-hover/cover:rotate-1 border-2 border-green-700 animate-float"
                  />
                  <div className="absolute -top-1 -right-1 bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    Book of the Month
                  </div>
                </Link>
                <div>
                  <motion.h3
                    className="text-xl font-bold text-green-800 dark:text-green-400 font-serif gradient-text"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {featuredBook.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-700 dark:text-gray-300 font-serif"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    by {featuredBook.author}
                  </motion.p>
                  {featuredBook.meetingDate && (
                    <motion.div
                      className="flex items-center gap-2 mt-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Calendar className="w-4 h-4 text-green-700 animate-pulse-slow" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-serif">
                        {featuredBook.meetingDate}
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              {featuredBook.quote && (
                <motion.div
                  className="relative mb-4 bg-gray-50 dark:bg-green-900/20 p-3 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Quote className="absolute -left-6 -top-2 w-5 h-5 text-green-400/30 animate-float" />
                  <p className="text-base text-gray-800 dark:text-gray-300 italic pl-6 font-serif">
                    "{featuredBook.quote}"
                  </p>
                </motion.div>
              )}

              {featuredBook.description && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h4 className="text-lg font-bold text-green-800 dark:text-green-400 font-serif mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-green-700 animate-pulse-slow" />
                    About Book
                  </h4>
                  <p className="text-gray-800 dark:text-gray-300 font-serif bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-green-700/20 shadow-inner">
                    {featuredBook.description}
                  </p>
                </motion.div>
              )}

              {featuredBook.meetingLink && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="w-full bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn shadow-lg"
                  >
                    <Link href={featuredBook.meetingLink} target="_blank" rel="noopener noreferrer">
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      <Star className="w-5 h-5 mr-2 animate-spin-slow" />
                      Join Discussion
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="relative">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen py-6 md:py-12">
          <div className="container mx-auto grid md:grid-cols-2 gap-8 px-4 md:px-8">
            {/* Left Column */}
            <motion.div
              className="flex flex-col justify-center gap-5 md:gap-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-5 md:space-y-8">
                {/* AI logo section */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative">
                    <motion.div
                      className="relative group cursor-pointer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(true)}
                    >
                      <Image
                        src="/logo.jpg"
                        alt="Reading Circle Logo"
                        width={80}
                        height={80}
                        className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] rounded-full border-4 border-green-700 shadow-lg transition-transform duration-300 group-hover:scale-110 animate-morph"
                      />
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 scale-0 group-hover:scale-100 transition-transform duration-300"
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(139, 92, 246, 0)",
                            "0 0 30px rgba(139, 92, 246, 0.6)",
                            "0 0 0 rgba(139, 92, 246, 0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />
                      {/* AI glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)",
                        }}
                      />
                      <div className="absolute -top-3 -right-3">
                        <GladwellButton size="large" onClick={() => setIsOpen(true)} />
                      </div>
                    </motion.div>
                  </div>
                    <motion.h1
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-800 dark:text-green-400 
                           font-serif relative inline-block group drop-shadow-md"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    >
                    The Reading Circle{" "}
                    <span className="inline-flex space-x-1 ml-1">
                      <span className="text-black dark:text-white">2</span>
                      <span className="text-red-600">5</span>
                      <span className="text-green-700">4</span>
                    </span>

                    {/* Hover background overlay */}
                    <motion.span
                      className="absolute -inset-1 bg-green-700/5 rounded-lg scale-x-0 group-hover:scale-x-100 
                           transition-transform origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                    />
                    </motion.h1>
                </div>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Sparkles className="absolute -right-8 -top-4 w-6 h-6 text-green-500/40 animate-spin-slow" />
                  <p className="text-base md:text-xl text-gray-900 dark:text-gray-300 max-w-lg bg-white/70 dark:bg-black/30 p-2 rounded-lg shadow-sm">
                    Discover, share, and review your favorite{" "}
                    <motion.span
                      className="text-green-700 dark:text-green-400 font-bold"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      books
                    </motion.span>{" "}
                    with a community of{" "}
                    <motion.span
                      className="text-green-700 dark:text-green-400 font-bold"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      book lovers
                    </motion.span>
                  </p>
                </motion.div>
              </div>

              {/* Button Links */}
              <div className="flex flex-wrap gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-green-700 hover:bg-green-800 text-white gap-2 group relative overflow-hidden font-serif shadow-lg"
                  >
                    <Link href="/books">
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 animate-pulse-slow" />
                      Explore Books
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-green-700 hover:bg-green-800 text-white gap-2 group relative overflow-hidden font-serif shadow-lg"
                  >
                    <Link href="/gallery">
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <ImagePlay className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12 animate-pulse-slow" />
                      View Gallery
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group relative overflow-hidden shadow-lg"
                  >
                    <Link href="/club-events">
                      <span className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Calendar className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 animate-pulse-slow" />
                      Check Events
                    </Link>
                  </Button>
                </motion.div>
                <ClubStatsButton />
                <ClubEventStatsButton />
              </div>

              {/* Mobile Book of the Month */}
              {featuredBook && (
                <motion.div
                  className="md:hidden mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <motion.button
                    onClick={() => setShowMobileBookDetails(true)}
                    className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border-2 border-green-700/30 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-green-700 animate-float"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="p-3 relative">
                      <div className="flex items-start gap-3">
                        <Link
                          href={
                            featuredBook.bookLink && !featuredBook.bookLink.includes("SINGLE_ITEM_ID")
                              ? featuredBook.bookLink
                              : `/books/${featuredBook.id}`
                          }
                          className="relative w-16 h-24 flex-shrink-0 group/cover"
                        >
                          <Image
                            src={featuredBook.coverImage || "/placeholder.svg"}
                            alt={`${featuredBook.title} Book Cover`}
                            fill
                            className="rounded-lg shadow-lg object-cover transition-transform duration-300 group-hover/cover:scale-105 group-hover/cover:rotate-1 border-2 border-green-700 animate-float"
                          />
                          <div className="absolute -top-1 -right-1 bg-green-700 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            Book of the Month
                          </div>
                        </Link>
                        <div className="flex-1">
                          <div>
                            <h3 className="text-base font-bold text-green-800 dark:text-green-400 font-serif gradient-text">
                              {featuredBook.title}
                            </h3>
                            <p className="text-xs text-gray-700 dark:text-gray-300 font-serif">
                              by {featuredBook.author}
                            </p>
                          </div>
                          {featuredBook.quote && (
                            <div className="relative mt-1">
                              <Quote className="absolute -left-4 top-0 w-3 h-3 text-green-400/30 animate-pulse-slow" />
                              <p className="text-xs text-gray-800 dark:text-gray-300 italic pl-4 font-serif line-clamp-1">
                                "{featuredBook.quote}"
                              </p>
                            </div>
                          )}
                          <div className="flex items-center justify-end mt-1 text-green-700 text-xs">
                            <span>View details</span>
                            <ChevronRight className="w-3 h-3 ml-1 animate-bounce-slow" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {featuredBook.meetingDate && (
                      <div className="bg-green-50 dark:bg-gray-700/50 p-2 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-green-700 animate-pulse-slow" />
                          <span className="text-xs text-gray-700 dark:text-gray-300 font-serif">
                            {featuredBook.meetingDate}
                          </span>
                        </div>
                        {featuredBook.meetingLink && (
                          <div className="bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn h-7 text-xs px-2 py-1 rounded-md shadow-lg">
                            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                            Join Discussion
                          </div>
                        )}
                      </div>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {/* Stats - Desktop Only */}
              <div className="hidden md:grid grid-cols-3 gap-6 mt-8">
                {[
                  {
                    label: "Books Read",
                    value: `${statsData.booksCount}`,
                    icon: BookOpen,
                    color: "green-700",
                    delay: 0.9,
                    description: "Curated collection",
                  },
                  {
                    label: "Community Reviews",
                    value: `${statsData.reviewsCount}+`,
                    icon: MessageSquare,
                    color: "green-700",
                    delay: 1.0,
                    description: "Member insights",
                  },
                  {
                    label: "Events Hosted",
                    value: `${statsData.eventsCount}`,
                    icon: Calendar,
                    color: "green-700",
                    delay: 1.1,
                    description: "Literary gatherings",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 text-center group hover:bg-green-700/10 dark:hover:bg-green-700/20 transition-all duration-300 hover:-translate-y-2 border-2 border-green-700 shadow-lg hover:shadow-xl animate-float hover-3d"
                    style={{ animationDelay: `${index * 0.2}s` }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stat.delay, duration: 0.5 }}
                    whileHover={{
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700/10 transition-colors duration-300"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon
                        className={`w-6 h-6 text-${stat.color} dark:text-green-400 transition-transform duration-300 group-hover:scale-110 animate-pulse-slow`}
                      />
                    </motion.div>
                    <motion.div
                      className="font-bold text-2xl text-green-800 dark:text-green-400 gradient-text"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: stat.delay + 0.2, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Scroll to Discover More */}
              <motion.div
                className="mt-8 w-full hidden md:flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <motion.button
                  onClick={() => scrollToSection("features")}
                  className="w-full text-green-700 dark:text-green-400 flex flex-col items-center gap-2 md:gap-3 group font-serif bg-white dark:bg-gray-800/50 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 border-green-700/30 hover:border-green-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ y: 0, boxShadow: "none" }}
                >
                  <span className="text-base md:text-lg font-medium">Scroll to discover more</span>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ChevronDown className="w-8 h-8 text-green-600 dark:text-green-500" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="flex flex-col justify-center gap-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Book of the Month Card - Desktop Only */}
              {featuredBook && (
                <motion.div
                  className="hidden md:block bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border-2 border-green-700/30 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-green-700 animate-float"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-6 relative">
                    <div className="flex items-start gap-6">
                      <Link
                        href={
                          featuredBook.bookLink && !featuredBook.bookLink.includes("SINGLE_ITEM_ID")
                            ? featuredBook.bookLink
                            : `/books/${featuredBook.id}`
                        }
                        className="block"
                      >
                        <motion.div
                          className="relative w-32 h-48 flex-shrink-0 group/cover perspective-1000"
                          ref={bookCoverRef}
                          whileHover={{ scale: 1.02 }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <Image
                            src={featuredBook.coverImage || "/placeholder.svg"}
                            alt={`${featuredBook.title} Book Cover`}
                            fill
                            className="rounded-lg shadow-lg object-cover transition-transform duration-300 group-hover/cover:scale-105 group-hover/cover:rotate-1 border-2 border-green-700"
                          />
                          <motion.div className="absolute -top-2 -right-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full">
                            Book of the Month
                          </motion.div>
                        </motion.div>
                      </Link>
                      <div className="flex-1 space-y-4">
                        <div>
                          <Link
                            href={
                              featuredBook.bookLink && !featuredBook.bookLink.includes("SINGLE_ITEM_ID")
                                ? featuredBook.bookLink
                                : `/books/${featuredBook.id}`
                            }
                            className="block hover:underline"
                          >
                            <motion.h3
                              className="text-2xl font-bold text-green-800 dark:text-green-400 font-serif gradient-text"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 }}
                            >
                              {featuredBook.title}
                            </motion.h3>
                          </Link>
                          <motion.p
                            className="text-gray-700 dark:text-gray-300 font-serif"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            by {featuredBook.author}
                          </motion.p>
                        </div>
                        {featuredBook.quote && (
                          <motion.div
                            className="relative bg-gray-50 dark:bg-green-900/20 p-3 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                          >
                            <Quote className="absolute -left-6 -top-2 w-4 h-4 text-green-400/30 animate-float" />
                            <p className="text-lg text-gray-800 dark:text-gray-300 italic pl-6 font-serif">
                              "{featuredBook.quote}"
                            </p>
                          </motion.div>
                        )}
                        {featuredBook.description && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <Button
                              variant="link"
                              className="text-green-700 hover:text-green-800 p-0 group/btn font-serif"
                              onClick={() => setShowAbout(!showAbout)}
                            >
                              About Book{""}
                              <motion.span
                                className="transition-transform duration-300 group-hover/btn:translate-x-1 inline-block"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                              >
                                →
                              </motion.span>
                            </Button>
                          </motion.div>
                        )}
                        {showAbout && featuredBook.description && (
                          <motion.p
                            className="text-gray-800 dark:text-gray-300 mt-4 font-serif bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-green-700/20 shadow-inner"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.5 }}
                          >
                            {featuredBook.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                  {featuredBook.meetingDate && (
                    <div className="bg-green-50 dark:bg-gray-700/50 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-700 animate-pulse-slow" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-serif">
                          {featuredBook.meetingDate}
                        </span>
                      </div>
                      {featuredBook.meetingLink && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            asChild
                            size="sm"
                            className="bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn shadow-lg"
                          >
                            <Link href={featuredBook.meetingLink} target="_blank" rel="noopener noreferrer">
                              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                              <Star className="w-4 h-4 mr-1 animate-spin-slow" />
                              Join Discussion
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Gallery Preview */}
              <div className="grid grid-cols-3 gap-4">
                {randomGalleryItems.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    className="relative aspect-square rounded-lg overflow-hidden group border-2 border-green-700 shadow-lg hover-3d"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      rotate: index % 2 === 0 ? 3 : -3,
                    }}
                  >
                    <Link href="/gallery">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.caption}
                        width={300}
                        height={300}
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        initial={{ y: "100%" }}
                        whileHover={{ y: 0 }}
                      >
                        <p className="text-white text-xs font-serif line-clamp-1">{item.caption}</p>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Scroll to discover more - Mobile Only */}
              <motion.div
                className="mt-4 w-full flex justify-center md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <motion.button
                  onClick={() => scrollToSection("features")}
                  className="w-full text-green-700 dark:text-green-400 flex flex-col items-center gap-2 md:gap-3 group font-serif bg-white dark:bg-gray-800/50 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 border-green-700/30 hover:border-green-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ y: 0, boxShadow: "none" }}
                >
                  <span className="text-base md:text-lg font-medium">Scroll to discover more</span>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ChevronDown className="w-8 h-8 text-green-600 dark:text-green-500" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

         {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif mb-4 relative inline-block group gradient-text"
                whileInView={{ scale: [0.9, 1.05, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Why Join Our Reading Circle?
                <motion.span
                  className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </motion.h2>
              <motion.p
                className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-serif"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Discover the benefits of being part of our literary community
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BookMarked,
                  title: "Curated Book Selection",
                  description:
                    "Each month, we carefully select thought-provoking books across various genres to expand your literary horizons.",
                  color: "green-700",
                },
                {
                  icon: Users,
                  title: "Vibrant Community",
                  description:
                    "Connect with fellow book enthusiasts who share your passion for reading and thoughtful discussion.",
                  color: "green-700",
                },
                {
                  icon: Calendar,
                  title: "Regular Meetups",
                  description:
                    "Join our scheduled in-person and virtual discussions to share insights and perspectives.",
                  color: "green-700",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-[#fffaf0] dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-green-700/30 hover:border-green-700 group relative hover-3d"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-700/10 transition-colors duration-300"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon
                      className={`w-6 h-6 text-${feature.color} dark:text-green-400 transition-transform duration-300 group-hover:scale-110 animate-pulse-slow`}
                    />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold text-green-800 dark:text-green-400 mb-2 font-serif gradient-text"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-700 dark:text-gray-300 font-serif"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="py-20 relative">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif mb-4 relative inline-block group gradient-text bg-white/70 dark:bg-transparent px-3 py-1 rounded-lg shadow-sm"
                whileInView={{ scale: [0.9, 1.05, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Upcoming Events
                <motion.span
                  className="absolute -inset-1 bg-green-700/5 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </motion.h2>
              <motion.p
                className="text-xl text-gray-900 dark:text-gray-300 max-w-2xl mx-auto font-serif bg-white/70 dark:bg-transparent px-3 py-1 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join us for these exciting literary gatherings
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.slice(0, 3).map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-green-700/30 hover:border-green-700 group relative hover-3d"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative h-48">
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover border-b-2 border-green-700/30 group-hover:border-green-700 transition-colors duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4">
                        <motion.h3
                          className="text-xl font-bold text-white mb-1 font-serif"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        >
                          {event.title}
                        </motion.h3>
                        <motion.p
                          className="text-green-300 font-serif"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                          {event.bookTitle !== "TBA" ? `${event.bookTitle}` : "Book to be announced"}
                        </motion.p>
                      </div>
                    </div>
                    <motion.div
                      className="absolute top-2 right-2 bg-green-700/90 text-white text-xs px-3 py-1 rounded-full font-serif backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.8, x: 10 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      animate={{ rotate: [0, 3, 0, -3, 0] }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {event.type}
                    </motion.div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 font-serif mb-4">
                      <motion.div
                        className="flex items-center gap-2 group/item"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        <CalendarCheck className="w-4 h-4 text-green-700 transition-transform duration-300 group-hover/item:scale-110 animate-pulse-slow" />
                        <span>{event.eventDate}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2 group/item"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      >
                        <Clock className="w-4 h-4 text-green-700 transition-transform duration-300 group-hover/item:scale-110 animate-pulse-slow" />
                        <span>{event.time}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2 group/item col-span-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      >
                        <MapPin className="w-4 h-4 text-green-700 transition-transform duration-300 group-hover/item:scale-110 animate-pulse-slow" />
                        <span>{event.location}</span>
                      </motion.div>
                    </div>
                    {event.link && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          asChild
                          className="w-full bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn shadow-lg"
                        >
                          <Link href={event.link} target="_blank" rel="noopener noreferrer">
                            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                            <Star className="w-5 h-5 mr-2 animate-spin-slow" />
                            Join Discussion
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                    {!event.link && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          asChild
                          className="w-full bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
                        >
                          <Link
                            href="https://wa.me/+254790964291?text=Hello%20Reading%20Circle%20Event%20Coordinator,%20I'm%20contacting%20from%20the%20website.%20I%20would%20like%20to%20know%20more%20about%20the%20upcoming%20bookclub%20events%20and%20discussions"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                            Inquire about Event
                            <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group relative overflow-hidden shadow-lg"
                >
                  <Link href="/club-events">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    View All Events
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 relative">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif mb-4 relative inline-block group gradient-text bg-white/70 dark:bg-transparent px-3 py-1 rounded-lg shadow-sm"
                whileInView={{ scale: [0.9, 1.05, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                What Our Members Say
                <motion.span
                  className="absolute -inset-1 bg-green-700/5 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </motion.h2>
              <motion.p
                className="text-xl text-gray-900 dark:text-gray-300 max-w-2xl mx-auto font-serif bg-white/70 dark:bg-transparent px-3 py-1 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Hear from our community of book lovers
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-green-700/30 hover:border-green-700 group relative hover-3d"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="relative mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Quote className="absolute -left-2 -top-2 w-8 h-8 text-green-200 dark:text-green-800 animate-float" />
                    <p className="text-gray-800 dark:text-gray-300 italic pl-6 relative z-10 font-serif">
                      "{testimonial.quote}"
                    </p>
                  </motion.div>
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={testimonial.avatar || "/placeholder.svg?height=60&width=60"}
                        alt={testimonial.title || "Member"}
                        width={60}
                        height={60}
                        className="rounded-full object-cover border-2 border-green-700 shadow-lg animate-morph"
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(21, 128, 61, 0)",
                            "0 0 10px rgba(21, 128, 61, 0.5)",
                            "0 0 0 rgba(21, 128, 61, 0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                      />
                    </motion.div>
                    <div>
                      <motion.h4
                        className="font-bold text-green-800 dark:text-green-400 gradient-text"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      >
                        {testimonial.title}
                      </motion.h4>
                      <motion.p
                        className="text-sm text-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      >
                        {testimonial.role}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-16 text-center bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-8 shadow-lg border-2 border-green-700/30 hover:border-green-700 max-w-3xl mx-auto group relative animate-float-slow"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                scale: 1.02,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <motion.h3
                className="text-2xl font-bold text-green-800 dark:text-green-400 mb-4 font-serif gradient-text"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Ready to Join Our Reading Circle?
              </motion.h3>
              <motion.p
                className="text-gray-700 dark:text-gray-300 mb-6 font-serif"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Become part of our growing community of book lovers. Sign up today to participate in our next
                discussion!
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn shadow-lg"
                  >
                    <Link href="/join-us">
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      <Heart className="w-5 h-5 mr-2 animate-pulse" />
                      Join Now
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group/btn relative overflow-hidden shadow-lg"
                  >
                    <Link href="/about-us">
                      <span className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <Smile className="w-5 h-5 mr-2 animate-pulse-slow" />
                      Learn More
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        
      </div>
    </div>
  )
}
