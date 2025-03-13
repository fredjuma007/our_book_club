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
} from "lucide-react"
import React, { useEffect, useState } from "react"
import Footer from "@/components/footer"
import { events } from "@/data/events"

export default function Home() {
  const [showAbout, setShowAbout] = React.useState(false)
  const [activeSection, setActiveSection] = useState("hero")

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
    <div className="relative bg-[url('/picnic.jpg')] bg-cover bg-fixed bg-center bg-no-repeat text-green-600 dark:text-green-500 overflow-x-hidden selection:bg-green-700/30">
      {/* Animated particles */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20 animate-fade" />

      {/* Main overlay */}
      <div className="fixed inset-0 bg-white/60 dark:bg-black/70 backdrop-blur-sm" />

      {/* Navigation dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {["hero", "features", "events", "testimonials"].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === section ? "bg-green-600 scale-125" : "bg-green-300 hover:bg-green-400"
            }`}
            aria-label={`Scroll to ${section} section`}
          />
        ))}
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen py-8">
          {/* Header Section */}
          <header className="px-4 md:px-8 mb-12">
            <motion.div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
              <div className="relative group">
                <Image
                  src="/logo.jpeg"
                  alt="Reading Circle Logo"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-green-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -inset-2 rounded-full bg-green-500/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif">
                The Reading Circle
              </h1>
            </motion.div>
          </header>

          <div className="container mx-auto grid md:grid-cols-2 gap-8 px-4 md:px-8">
            {/* Left Column */}
            <motion.div
              className="flex flex-col justify-center gap-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 dark:text-green-400 font-serif leading-tight relative group">
                  Where Books Come
                  <br />
                  <span className="block text-green-600 relative">
                    To Life
                    <Sparkles className="absolute -right-8 -top-4 w-6 h-6 text-green-500/40 animate-spin-slow" />
                  </span>
                  <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 max-w-lg">
                  Discover, share, and review your favorite{" "}
                  <span className="text-green-600 dark:text-green-400">books</span> with a community of{" "}
                  <span className="text-green-600 dark:text-green-400">book lovers</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-700 hover:bg-green-800 text-white gap-2 group relative overflow-hidden font-serif"
                >
                  <Link href="/books">
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    Explore Books
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-green-700 hover:bg-green-800 text-white gap-2 group relative overflow-hidden font-serif"
                >
                  <Link href="/gallery">
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <ImagePlay className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    View Gallery
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 gap-2 group font-serif relative overflow-hidden"
                >
                  <Link href="/club-events">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Calendar className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    Check Events
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 gap-2 group font-serif relative overflow-hidden"
                >
                  <Link href="/about-us">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Info className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                    About
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { label: "Members", value: "100+", icon: Users },
                  { label: "Books Read", value: "13", icon: BookOpen },
                  { label: "Events", value: "3+", icon: Calendar },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#fffaf0] dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-center group hover:bg-green-50 dark:hover:bg-gray-700/80 transition-all duration-300 hover:-translate-y-1 border border-green-700/30 hover:border-green-700"
                  >
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-green-700 transition-transform duration-300 group-hover:scale-110" />
                    <div className="font-bold text-xl text-green-800 dark:text-green-400 font-serif">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-serif">{stat.label}</div>
                  </div>
                ))}
              </div>

              <motion.div
                className="mt-12 flex justify-center md:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-green-700 dark:text-green-400 flex flex-col items-center gap-2 group font-serif"
                >
                  <span className="text-sm font-medium">Scroll to discover more</span>
                  <ChevronDown className="w-6 h-6 animate-bounce" />
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
              {/* Book of the Month Card */}
              <div className="bg-[#fffaf0] dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-green-700/30 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-green-700">
                <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="p-6 relative">
                  <div className="flex items-start gap-6">
                    <Link
                      href="https://readingcircle.vercel.app/books/e113461c-75f3-42f8-a2db-765142c9ce05"
                      className="relative w-32 h-48 flex-shrink-0 group/cover"
                    >
                      <Image
                        src="/sometimes i lie.jpg"
                        alt="Sometimes I Lie Book Cover"
                        fill
                        className="rounded-lg shadow-lg object-cover transition-transform duration-300 group-hover/cover:scale-105 group-hover/cover:rotate-2 border-2 border-green-700"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full">
                        Book of the Month
                      </div>
                    </Link>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 font-serif">
                          Sometimes I Lie
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 font-serif">by Alice Feeney</p>
                      </div>
                      <div className="relative">
                        <Quote className="absolute -left-6 -top-2 w-4 h-4 text-green-400/30" />
                        <p className="text-lg text-gray-700 dark:text-gray-300 italic pl-6 font-serif">
                          "People are not mirrors—they don't see you how you see yourself."
                        </p>
                      </div>
                      <Button
                        variant="link"
                        className="text-green-700 hover:text-green-800 p-0 group/btn font-serif"
                        onClick={() => setShowAbout(!showAbout)}
                      >
                        About Book{""}
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1 inline-block">
                          →
                        </span>
                      </Button>
                      {showAbout && (
                        <p className="text-gray-700 dark:text-gray-300 mt-4 font-serif">
                          Amber wakes up in a hospital. She can't move. She can't speak. She can't open her eyes. She
                          can hear everyone around her, but they have no idea. Amber doesn't remember what happened, but
                          she has a suspicion her husband had something to do with it. Alternating between her paralyzed
                          present, the week before her accident, and a series of childhood diaries from twenty years
                          ago, this brilliant psychological thriller Is something really a lie if you believe it's the
                          truth?
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-gray-700/50 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-700" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-serif">29th March</span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
                  >
                    <Link href="https://meet.google.com/vhv-hfwz-avi" target="_blank" rel="noopener noreferrer">
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      Join Discussion
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Gallery Preview */}
              <div className="grid grid-cols-3 gap-3">
                {["bottles.jpg", "sinners.jpg", "Discussion.jpg"].map((filename, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="relative aspect-square rounded-lg overflow-hidden group border-2 border-green-700"
                  >
                    <Image
                      src={`/gallery/${filename}`}
                      alt={`Gallery image ${index + 1}`}
                      width={300}
                      height={300}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif mb-4 relative inline-block group">
                Why Join Our Reading Circle?
                <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-serif">
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
                },
                {
                  icon: Users,
                  title: "Vibrant Community",
                  description:
                    "Connect with fellow book enthusiasts who share your passion for reading and thoughtful discussion.",
                },
                {
                  icon: Calendar,
                  title: "Regular Meetups",
                  description:
                    "Join our scheduled in-person and virtual discussions to share insights and perspectives.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-[#fffaf0] dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-green-700/30 hover:border-green-700 group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-700/10 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-green-700 dark:text-green-400 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2 font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-serif">{feature.description}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif mb-4 relative inline-block group">
                Upcoming Events
                <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-serif">
                Join us for these exciting literary gatherings
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="bg-[#fffaf0] dark:bg-gray-800/90 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-green-700/30 hover:border-green-700 group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative h-48">
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover border-b-2 border-green-700/30 group-hover:border-green-700 transition-colors duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white mb-1 font-serif">{event.title}</h3>
                        <p className="text-green-300 font-serif">
                          {event.bookTitle !== "TBA" ? `${event.bookTitle}` : "Book to be announced"}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-700/90 text-white text-xs px-3 py-1 rounded-full font-serif backdrop-blur-sm">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300 font-serif mb-4">
                      <div className="flex items-center gap-2 group/item">
                        <CalendarCheck className="w-4 h-4 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                        <span>{event.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-2 group/item">
                        <Clock className="w-4 h-4 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 group/item col-span-2">
                        <MapPin className="w-4 h-4 text-green-700 transition-transform duration-300 group-hover/item:scale-110" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    {event.link && (
                      <Button
                        asChild
                        className="w-full bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
                      >
                        <Link href={event.link} target="_blank" rel="noopener noreferrer">
                          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                          Join Discussion
                        </Link>
                      </Button>
                    )}
                    {!event.link && (
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
                          Inquire More
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
                className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group relative overflow-hidden"
              >
                <Link href="/club-events">
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
              <h2 className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif mb-4 relative inline-block group">
                What Our Members Say
                <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-serif">
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
                },
                {
                  name: "John King'ori",
                  role: "Member since 2024",
                  quote:
                    "I love how diverse our book selections are. From thrillers to literary fiction to memoirs, there's always something new to discover and discuss.",
                  avatar: "/gallery/jey.jpg",
                },
                {
                  name: "Purity Migwi",
                  role: "Member since 2024",
                  quote:
                    "The Reading Circle has been a great way for me to connect with other book lovers. I've learned so much from our discussions and I look forward to each meeting.",
                  avatar: "/gallery/maya.jpg",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-[#fffaf0] dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-green-700/30 hover:border-green-700 group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative mb-6">
                    <Quote className="absolute -left-2 -top-2 w-8 h-8 text-green-200 dark:text-green-800" />
                    <p className="text-gray-700 dark:text-gray-300 italic pl-6 relative z-10 font-serif">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover border-2 border-green-700"
                    />
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-400 font-serif">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-serif">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-16 text-center bg-[#fffaf0] dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-8 shadow-lg border border-green-700/30 hover:border-green-700 max-w-3xl mx-auto group relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-4 font-serif">
                Ready to Join Our Reading Circle?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 font-serif">
                Become part of our growing community of book lovers. Sign up today to participate in our next
                discussion!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
                >
                  <Link
                    href="https://wa.me/+254714747231?text=Hello%20Reading%20Circle%20Membership%20Admin,%20I%20would%20like%20to%20join%20your%20community"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    Join Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group/btn relative overflow-hidden"
                >
                  <Link href="/about-us">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
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
