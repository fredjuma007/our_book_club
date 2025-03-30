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
  Users,
  ChevronDown,
  BookMarked,
  MapPin,
  Clock,
  CalendarCheck,
  Info,
  ChevronRight,
  X,
  Heart,
  Star,
  Smile,
} from "lucide-react"
import React, { useEffect, useState } from "react"
import Footer from "@/components/footer"
import { events } from "@/data/events"
import { galleryItems } from "@/data/gallery"

export default function Home() {
  const [showAbout, setShowAbout] = React.useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [showMobileBookDetails, setShowMobileBookDetails] = useState(false)

  // Get featured gallery items for the homepage preview
  const [randomGalleryItems, setRandomGalleryItems] = useState<typeof galleryItems>([])

  // Select random gallery items on component mount
  useEffect(() => {
    // Create a copy of the gallery items array
    const shuffled = [...galleryItems]

    // Shuffle the array using Fisher-Yates algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Take the first 3 items
    setRandomGalleryItems(shuffled.slice(0, 3))
  }, [])

  // Handle scroll and set active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "events", "testimonials"]
      const scrollPosition = window.scrollY + 200

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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative bg-[url('/picnic.jpg')] bg-cover bg-fixed bg-center bg-no-repeat text-blueberry dark:text-sky overflow-x-hidden selection:bg-candy/30">
      {/* Animated particles */}
      <div className="fixed inset-0 star-bg animate-fade" />

      {/* Main overlay */}
      <div className="fixed inset-0 bg-sky/10 dark:bg-blueberry/70 backdrop-blur-sm" />

      {/* Navigation dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {["hero", "features", "events", "testimonials"].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
              activeSection === section ? "bg-candy shadow-childish scale-125" : "bg-sunshine hover:bg-orange"
            }`}
            aria-label={`Scroll to ${section} section`}
          >
            {activeSection === section && <Heart className="w-3 h-3 text-white animate-pulse" />}
          </button>
        ))}
      </div>

      {/* Mobile Book Details Modal */}
      {showMobileBookDetails && (
        <div className="fixed inset-0 bg-blueberry/70 backdrop-blur-sm z-50 md:hidden flex items-center justify-center p-4">
          <div className="bg-white dark:bg-blueberry rounded-3xl shadow-childish-xl w-full max-w-md max-h-[80vh] overflow-auto border-4 border-candy animate-rainbow-border">
            <div className="p-6 relative">
              <button
                onClick={() => setShowMobileBookDetails(false)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-cherry text-white flex items-center justify-center hover:bg-cherry/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-24 h-36 flex-shrink-0">
                  <Image
                    src="/the_anxious_generation.jpg"
                    alt="book cover"
                    fill
                    className="rounded-2xl shadow-childish object-cover border-4 border-sky"
                  />
                  <div className="absolute -top-3 -right-3 bg-cherry text-white text-xs px-3 py-1 rounded-full shadow-childish transform rotate-3">
                    Book of the Month
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blueberry dark:text-sky">The Anxious Generation</h3>
                  <p className="text-blueberry/70 dark:text-sky/70">by Jonathan Haidt</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-5 h-5 text-candy" />
                    <span className="text-sm text-blueberry/70 dark:text-sky/70">3rd May</span>
                  </div>
                </div>
              </div>

              <div className="relative mb-6 bg-sunshine/20 p-4 rounded-2xl">
                <Quote className="absolute -left-3 -top-3 w-8 h-8 text-sunshine" />
                <p className="text-base text-blueberry dark:text-sky italic pl-4">
                  "People don’t get depressed when they face threats collectively; they get depressed when they feel isolated, lonely, or useless."
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-blueberry dark:text-sky mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-sky" />
                  About Book
                </h4>
                <p className="text-blueberry/80 dark:text-sky/80 bg-white/50 dark:bg-blueberry/50 p-4 rounded-2xl border-2 border-dashed border-sky">
                The Anxious Generation: How the Great Rewiring of Childhood Caused an Epidemic of Mental Illness
                 by Jonathan Haidt explores how the rise of smartphones, 
                social media, and overprotective parenting have contributed to skyrocketing anxiety, depression,
                 and loneliness among young people. Haidt argues that the "great rewiring" of childhood—marked by 
                 decreased independence, less face-to-face interaction, and constant digital engagement—has led to 
                 a mental health crisis. He proposes solutions to help restore childhood to a healthier, more resilient state.
                </p>
              </div>

              <Button
                asChild
                className="w-full bg-candy hover:bg-candy/80 text-white shadow-childish rounded-full py-6 relative overflow-hidden group/btn"
              >
                <Link href="https://meet.google.com/vhv-hfwz-avi" target="_blank" rel="noopener noreferrer">
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  <Star className="w-5 h-5 mr-2 animate-spin-slow" />
                  Join Discussion
                </Link>
              </Button>
            </div>
          </div>
        </div>
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
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative group">
                    <Image
                      src="/logo.jpeg"
                      alt="Reading Circle Logo"
                      width={80}
                      height={80}
                      className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] rounded-full border-4 border-candy shadow-childish transition-transform duration-300 group-hover:scale-110 animate-wiggle"
                    />
                    <div className="absolute -inset-2 rounded-full bg-sunshine/30 scale-0 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blueberry dark:text-sky relative inline-block group rainbow-text">
                    Little Hearts, Big Dreams
                    <span className="absolute -inset-1 bg-candy/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </h1>
                </div>
                <div className="relative">
                  <Sparkles className="absolute -right-8 -top-4 w-8 h-8 text-sunshine animate-spin-slow" />
                  <p className="text-xl md:text-2xl text-blueberry dark:text-sky/90 max-w-lg">
                    Discover, share, and review your favorite <span className="text-candy font-bold">books</span> with a
                    community of <span className="text-sky font-bold">book lovers</span>
                  </p>
                </div>
              </div>

              {/* Button Links */}
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-sky hover:bg-sky/80 text-white gap-2 group relative overflow-hidden rounded-full shadow-childish py-7"
                >
                  <Link href="/books">
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <BookOpen className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                    Explore Books
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-candy hover:bg-candy/80 text-white gap-2 group relative overflow-hidden rounded-full shadow-childish py-7"
                >
                  <Link href="/gallery">
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <ImagePlay className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                    View Gallery
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-4 border-sunshine text-blueberry dark:text-sunshine hover:bg-sunshine/20 gap-2 group rounded-full shadow-childish py-7 relative overflow-hidden"
                >
                  <Link href="/club-events">
                    <span className="absolute inset-0 bg-sunshine/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Calendar className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    Check Events
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-4 border-grass text-blueberry dark:text-grass hover:bg-grass/20 gap-2 group rounded-full shadow-childish py-7 relative overflow-hidden"
                >
                  <Link href="/about-us">
                    <span className="absolute inset-0 bg-grass/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Info className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                    About
                  </Link>
                </Button>
              </div>

              {/* Mobile Book of the Month */}
              <div className="md:hidden mt-4">
                <button
                  onClick={() => setShowMobileBookDetails(true)}
                  className="w-full text-left bg-white dark:bg-blueberry/80 backdrop-blur-md rounded-3xl shadow-childish overflow-hidden border-4 border-sky group hover:shadow-childish-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-4 relative">
                    <div className="flex items-start gap-3">
                      <Link
                        href="https://readingcircle.vercel.app/books/e113461c-75f3-42f8-a2db-765142c9ce05"
                        className="relative w-16 h-24 flex-shrink-0 group/cover"
                      >
                        <Image
                          src="/the_anxious_generation.jpg"
                          alt="Book Cover"
                          fill
                          className="rounded-xl shadow-childish object-cover transition-transform duration-300 group-hover/cover:scale-105 group-hover/cover:rotate-2 border-4 border-candy"
                        />
                        <div className="absolute -top-2 -right-2 bg-cherry text-white text-[10px] px-2 py-1 rounded-full transform rotate-3 shadow-childish">
                          Book of the Month
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div>
                          <h3 className="text-base font-bold text-blueberry dark:text-sky">The Anxious Generation</h3>
                          <p className="text-xs text-blueberry/70 dark:text-sky/70">by Jonathan Haidt</p>
                        </div>
                        <div className="relative mt-2">
                          <Quote className="absolute -left-4 top-0 w-4 h-4 text-sunshine" />
                          <p className="text-xs text-blueberry/80 dark:text-sky/80 italic pl-4 line-clamp-1">
                            "People don’t get depressed when they face threats collectively; they get depressed when they feel isolated, lonely, or useless."
                          </p>
                        </div>
                        <div className="flex items-center justify-end mt-2 text-candy text-xs">
                          <span>View details</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-sunshine/30 dark:bg-sunshine/20 p-3 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-blueberry dark:text-sky" />
                      <span className="text-xs text-blueberry/80 dark:text-sky/80">3rd May</span>
                    </div>
                    <div className="bg-candy hover:bg-candy/80 text-white transition-all duration-300 relative overflow-hidden group/btn h-8 text-xs px-3 py-1 rounded-full shadow-childish">
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      Join Discussion
                    </div>
                  </div>
                </button>
              </div>

              {/* Stats - Desktop Only */}
              <div className="hidden md:grid grid-cols-3 gap-6 mt-8">
                {[
                  { label: "Members", value: "100+", icon: Users },
                  { label: "Books Read", value: "13", icon: BookOpen },
                  { label: "Events", value: "3+", icon: Calendar },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`bg-white dark:bg-blueberry/80 backdrop-blur-sm p-5 rounded-3xl text-center group hover:bg-${index === 0 ? "candy" : index === 1 ? "sky" : "sunshine"}/10 dark:hover:bg-${index === 0 ? "candy" : index === 1 ? "sky" : "sunshine"}/20 transition-all duration-300 hover:-translate-y-2 border-4 ${index === 0 ? "border-candy" : index === 1 ? "border-sky" : "border-sunshine"} shadow-childish hover:shadow-childish-lg animate-float`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <stat.icon
                      className={`w-10 h-10 mx-auto mb-3 ${index === 0 ? "text-candy" : index === 1 ? "text-sky" : "text-sunshine"} transition-transform duration-300 group-hover:scale-110`}
                    />
                    <div className="font-bold text-2xl text-blueberry dark:text-sky">{stat.value}</div>
                    <div className="text-sm text-blueberry/70 dark:text-sky/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Desktop Scroll to Discover More */}
              <motion.div
                className="mt-8 w-full hidden md:flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <button
                  onClick={() => scrollToSection("features")}
                  className="w-full text-blueberry dark:text-sky flex flex-col items-center gap-3 group bg-white/50 dark:bg-blueberry/50 backdrop-blur-sm px-6 py-4 rounded-3xl border-4 border-dashed border-sky hover:border-candy transition-all duration-300 hover:-translate-y-2 hover:shadow-childish"
                >
                  <span className="text-xl font-bold">Scroll to discover more</span>
                  <ChevronDown className="w-10 h-10 animate-bounce-slow text-candy dark:text-candy" />
                  <div className="absolute inset-0 bg-gradient-to-r from-sky/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                </button>
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
              <div className="hidden md:block bg-white dark:bg-blueberry/80 backdrop-blur-md rounded-3xl shadow-childish-lg overflow-hidden border-4 border-candy group hover:shadow-childish-xl transition-all duration-300 hover:-translate-y-2 animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-candy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="p-6 relative">
                  <div className="flex items-start gap-6">
                    <Link
                      href="https://readingcircle.vercel.app/books/0ff3b310-acd6-4a8d-b468-6542a9f818e0"
                      className="relative w-32 h-48 flex-shrink-0 group/cover"
                    >
                      <Image
                        src="/the_anxious_generation.jpg"
                        alt="Book Cover"
                        fill
                        className="rounded-2xl shadow-childish object-cover transition-transform duration-300 group-hover/cover:scale-105 group-hover/cover:rotate-2 border-4 border-sky"
                      />
                      <div className="absolute -top-3 -right-3 bg-cherry text-white text-sm px-3 py-1 rounded-full shadow-childish transform rotate-3">
                        Book of the Month
                      </div>
                    </Link>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-blueberry dark:text-sky">The Anxious Generation</h3>
                        <p className="text-blueberry/70 dark:text-sky/70">by Jonathan Haidt</p>
                      </div>
                      <div className="relative bg-sunshine/20 p-4 rounded-2xl">
                        <Quote className="absolute -left-3 -top-3 w-6 h-6 text-sunshine" />
                        <p className="text-lg text-blueberry dark:text-sky italic pl-4">
                          "People don’t get depressed when they face threats collectively; they get depressed when they feel isolated, lonely, or useless."
                        </p>
                      </div>
                      <Button
                        variant="link"
                        className="text-candy hover:text-candy/80 p-0 group/btn font-bold"
                        onClick={() => setShowAbout(!showAbout)}
                      >
                        About Book{""}
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1 inline-block ml-1">
                          →
                        </span>
                      </Button>
                      {showAbout && (
                        <p className="text-blueberry/80 dark:text-sky/80 mt-4 bg-white/50 dark:bg-blueberry/50 p-4 rounded-2xl border-2 border-dashed border-sky">
                          The Anxious Generation: How the Great Rewiring of Childhood Caused an Epidemic of Mental Illness by Jonathan Haidt 
                          explores how the rise of smartphones, social media, and overprotective parenting have contributed to skyrocketing anxiety,
                           depression, and loneliness among young people. Haidt argues that the "great rewiring" of childhood—marked by decreased 
                           independence, less face-to-face interaction, and constant digital engagement—has led to a mental health crisis.
                           He proposes solutions to help restore childhood to a healthier, more resilient state.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-sunshine/30 dark:bg-sunshine/20 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blueberry dark:text-sky" />
                    <span className="text-sm text-blueberry/80 dark:text-sky/80">3rd May</span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-candy hover:bg-candy/80 text-white transition-all duration-300 relative overflow-hidden group/btn rounded-full shadow-childish"
                  >
                    <Link href="https://meet.google.com/vhv-hfwz-avi" target="_blank" rel="noopener noreferrer">
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      <Star className="w-4 h-4 mr-1 animate-spin-slow" />
                      Join Discussion
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Gallery Preview */}
              <div className="grid grid-cols-3 gap-4">
                {randomGalleryItems.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    whileHover={{ y: -5, rotate: index % 2 === 0 ? 3 : -3 }}
                    className="relative aspect-square rounded-3xl overflow-hidden group border-4 border-sky shadow-childish hover:shadow-childish-lg transition-all duration-300"
                    style={{ animationDelay: `${index * 0.3}s` }}
                  >
                    <Link href="/gallery">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.caption}
                        width={300}
                        height={300}
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blueberry/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 bg-candy/80 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-bold line-clamp-1">{item.caption}</p>
                      </div>
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
                <button
                  onClick={() => scrollToSection("features")}
                  className="w-full text-blueberry dark:text-sky flex flex-col items-center gap-3 group bg-white/50 dark:bg-blueberry/50 backdrop-blur-sm px-4 py-4 rounded-3xl border-4 border-dashed border-sky hover:border-candy transition-all duration-300 hover:-translate-y-2 hover:shadow-childish"
                >
                  <span className="text-lg font-bold">Scroll to discover more</span>
                  <ChevronDown className="w-8 h-8 animate-bounce-slow text-candy dark:text-candy" />
                  <div className="absolute inset-0 bg-gradient-to-r from-sky/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                </button>
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
              <h2 className="text-3xl md:text-4xl font-bold text-blueberry dark:text-sky mb-4 relative inline-block group rainbow-text">
                Why Join Our Reading Circle?
                <span className="absolute -inset-1 bg-candy/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </h2>
              <p className="text-xl text-blueberry/80 dark:text-sky/80 max-w-2xl mx-auto">
                Discover the benefits of being part of our literary community
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BookMarked,
                  title: "Curated Book Selection",
                  description:
                    "Each month, we carefully select thought-provoking books across various genres to expand your literary horizons.",
                  color: "candy",
                },
                {
                  icon: Users,
                  title: "Vibrant Community",
                  description:
                    "Connect with fellow book enthusiasts who share your passion for reading and thoughtful discussion.",
                  color: "sky",
                },
                {
                  icon: Calendar,
                  title: "Regular Meetups",
                  description:
                    "Join our scheduled in-person and virtual discussions to share insights and perspectives.",
                  color: "sunshine",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`bg-white dark:bg-blueberry/80 backdrop-blur-md rounded-3xl p-6 shadow-childish hover:shadow-childish-lg transition-all duration-300 hover:-translate-y-3 border-4 border-${feature.color} group relative animate-float`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                  <div
                    className={`w-16 h-16 bg-${feature.color}/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-${feature.color}/30 transition-colors duration-300`}
                  >
                    <feature.icon
                      className={`w-8 h-8 text-${feature.color} transition-transform duration-300 group-hover:scale-110`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-blueberry dark:text-sky mb-3">{feature.title}</h3>
                  <p className="text-blueberry/80 dark:text-sky/80">{feature.description}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-blueberry dark:text-sky mb-4 relative inline-block group rainbow-text">
                Upcoming Events
                <span className="absolute -inset-1 bg-candy/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </h2>
              <p className="text-xl text-blueberry/80 dark:text-sky/80 max-w-2xl mx-auto">
                Join us for these exciting literary gatherings
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-white dark:bg-blueberry/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-childish hover:shadow-childish-lg transition-all duration-300 hover:-translate-y-3 border-4 border-sky group relative animate-float"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative h-48">
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover border-b-4 border-sky group-hover:border-candy transition-colors duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blueberry/70 to-transparent flex items-end">
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                        <p className="text-sunshine">
                          {event.bookTitle !== "TBA" ? `${event.bookTitle}` : "Book to be announced"}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-cherry text-white text-xs px-3 py-1 rounded-full shadow-childish transform rotate-3">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-blueberry/80 dark:text-sky/80 mb-4">
                      <div className="flex items-center gap-2 group/item">
                        <CalendarCheck className="w-5 h-5 text-candy transition-transform duration-300 group-hover/item:scale-110" />
                        <span>{event.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-2 group/item">
                        <Clock className="w-5 h-5 text-sky transition-transform duration-300 group-hover/item:scale-110" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 group/item col-span-2">
                        <MapPin className="w-5 h-5 text-sunshine transition-transform duration-300 group-hover/item:scale-110" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    {event.link && (
                      <Button
                        asChild
                        className="w-full bg-candy hover:bg-candy/80 text-white transition-all duration-300 relative overflow-hidden group/btn rounded-full shadow-childish py-6"
                      >
                        <Link href={event.link} target="_blank" rel="noopener noreferrer">
                          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                          <Star className="w-5 h-5 mr-2 animate-spin-slow" />
                          Join Discussion
                        </Link>
                      </Button>
                    )}
                    {!event.link && (
                      <Button
                        asChild
                        className="w-full bg-sky hover:bg-sky/80 text-white transition-all duration-300 relative overflow-hidden group/btn rounded-full shadow-childish py-6"
                      >
                        <Link
                          href="https://wa.me/+254790964291?text=Hello%20Reading%20Circle%20Event%20Coordinator,%20I'm%20contacting%20from%20the%20website.%20I%20would%20like%20to%20know%20more%20about%20the%20upcoming%20bookclub%20events%20and%20discussions"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                          <Heart className="w-5 h-5 mr-2 animate-pulse" />
                          Inquire To Donate
                        </Link>
                      </Button>
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-4 border-sunshine text-blueberry dark:text-sunshine hover:bg-sunshine/20 group relative overflow-hidden rounded-full shadow-childish py-7"
              >
                <Link href="/club-events">
                  <span className="absolute inset-0 bg-sunshine/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  View All Events
                </Link>
              </Button>
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
              <h2 className="text-3xl md:text-4xl font-bold text-blueberry dark:text-sky mb-4 relative inline-block group rainbow-text">
                What Our Members Say
                <span className="absolute -inset-1 bg-candy/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </h2>
              <p className="text-xl text-blueberry/80 dark:text-sky/80 max-w-2xl mx-auto">
                Hear from our community of book lovers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Esther Ndunge",
                  role: "Member since 2024",
                  quote:
                    "The Reading Circle has introduced me to books I would have never picked up on my own. The discussions are always insightful and I've made wonderful friends.",
                  avatar: "/gallery/Ndunge.jpg",
                  color: "candy",
                },
                {
                  name: "John King'ori",
                  role: "Member since 2024",
                  quote:
                    "I love how diverse our book selections are. From thrillers to literary fiction to memoirs, there's always something new to discover and discuss.",
                  avatar: "/gallery/jey.jpg",
                  color: "sky",
                },
                {
                  name: "Purity Migwi",
                  role: "Member since 2024",
                  quote:
                    "The Reading Circle has been a great way for me to connect with other book lovers. I've learned so much from our discussions and I look forward to each meeting.",
                  avatar: "/gallery/maya.jpg",
                  color: "sunshine",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className={`bg-white dark:bg-blueberry/80 backdrop-blur-md rounded-3xl p-6 shadow-childish hover:shadow-childish-lg transition-all duration-300 hover:-translate-y-3 border-4 border-${testimonial.color} group relative animate-float`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                  <div className={`relative mb-6 bg-${testimonial.color}/20 p-4 rounded-2xl`}>
                    <Quote className={`absolute -left-3 -top-3 w-8 h-8 text-${testimonial.color}`} />
                    <p className="text-blueberry/80 dark:text-sky/80 italic pl-4 relative z-10">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover border-4 border-sky shadow-childish"
                    />
                    <div>
                      <h4 className="font-bold text-blueberry dark:text-sky">{testimonial.name}</h4>
                      <p className="text-sm text-blueberry/70 dark:text-sky/70">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-16 text-center bg-white dark:bg-blueberry/80 backdrop-blur-md rounded-3xl p-8 shadow-childish-lg border-4 border-candy animate-rainbow-border max-w-3xl mx-auto group relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-candy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              <h3 className="text-2xl font-bold text-blueberry dark:text-sky mb-4">
                Ready to Join Our Reading Circle?
              </h3>
              <p className="text-blueberry/80 dark:text-sky/80 mb-6">
                Become part of our growing community of book lovers. Sign up today to participate in our next
                discussion!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-candy hover:bg-candy/80 text-white transition-all duration-300 relative overflow-hidden group/btn rounded-full shadow-childish py-7"
                >
                  <Link
                    href="https://wa.me/+254714747231?text=Hello%20Reading%20Circle%20Membership%20Admin,%20I%20would%20like%20to%20join%20your%20community"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <Heart className="w-5 h-5 mr-2 animate-pulse" />
                    Join Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-4 border-sky text-blueberry dark:text-sky hover:bg-sky/20 group/btn relative overflow-hidden rounded-full shadow-childish py-7"
                >
                  <Link href="/about-us">
                    <span className="absolute inset-0 bg-sky/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <Smile className="w-5 h-5 mr-2" />
                    Learn More
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
