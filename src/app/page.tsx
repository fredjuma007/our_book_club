"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, Calendar, ImagePlay, Quote, Sparkles, Users } from "lucide-react"
import React from "react"

export default function Home() {
  const [showAbout, setShowAbout] = React.useState(false)
  return (
    <div className="relative min-h-screen bg-[url('/picnic.jpg')] bg-cover bg-fixed bg-center bg-no-repeat text-green-600 dark:text-green-500 overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20 animate-fade" />

      {/* Main overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-black/70 backdrop-blur-sm" />

      <div className="relative min-h-screen flex flex-col">
        {/* Header Section */}
        <header className="pt-8 px-4 md:px-8">
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

        {/* Main Content */}
        <main className="flex-grow grid md:grid-cols-2 gap-8 px-4 md:px-8 py-12">
          {/* Left Column */}
          <motion.div className="flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 dark:text-green-400 font-serif leading-tight">
                Where Books Come
                <br />
                <span className="block text-green-600 relative">
                  To Life
                  <Sparkles className="absolute -right-8 -top-4 w-6 h-6 text-green-500/40 animate-spin-slow" />
                </span>
              </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 max-w-lg">
                Discover, share, and review your favorite 
                <span className="text-green-600 dark:text-green-400">
                  books
                  </span> with a community of <span className="text-green-600 dark:text-green-400">book lovers</span>
                </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 group relative overflow-hidden"
              >
                <Link href="/books">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  Explore Books
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white gap-2 group relative overflow-hidden"
              >
                <Link href="/gallery">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <ImagePlay className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  View Gallery
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 gap-2 group"
              >
                <Link href="/club-events">
                  <Calendar className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  Join Events
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
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-center group hover:bg-green-50 dark:hover:bg-gray-700/80 transition-all duration-300 hover:-translate-y-1"
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                  <div className="font-bold text-xl text-green-800 dark:text-green-400">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div className="flex flex-col justify-center gap-6">
            {/* Book of the Month Card */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-green-200 dark:border-green-900 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <Link
                    href="http://localhost:3000/books/e113461c-75f3-42f8-a2db-765142c9ce05"
                    className="relative w-32 h-48 flex-shrink-0"
                  >
                    <Image
                      src="/sometimes i lie.jpg"
                      alt="Sometimes I Lie Book Cover"
                      fill
                      className="rounded-lg shadow-lg object-cover transition-all duration-300 group-hover:scale-105 group-hover:rotate-2"
                    />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Book of the Month
                    </div>
                  </Link>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-green-800 dark:text-green-400">Sometimes I Lie</h3>
                      <p className="text-gray-600 dark:text-gray-300">by Alice Feeney</p>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -left-6 -top-2 w-4 h-4 text-green-400/30" />
                      <p className="text-lg text-gray-700 dark:text-gray-300 italic pl-6">
                        "People are not mirrors—they don't see you how you see yourself."
                      </p>
                    </div>
                    <Button
                      variant="link"
                      className="text-green-600 hover:text-green-700 p-0 group"
                      onClick={() => setShowAbout(!showAbout)}
                    >
                      About Book{""}
                      <span className="transition-transform duration-300 group-hover:translate-x-1 inline-block">
                        →
                      </span>
                    </Button>
                    {showAbout && (
                      <p className="text-gray-700 dark:text-gray-300 mt-4">
                        This is a gripping psychological thriller about a woman who wakes up in a hospital bed, unable
                        to move or speak, and with no memory of how she got there. As she pieces together her memories,
                        she realizes that someone close to her is hiding a dark secret.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-gray-700/50 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">100+ members reading</span>
                </div>
                <Button asChild size="sm" variant="outline" className="border-green-500">
                  <Link href="/club-events" target="_blank" rel="noopener noreferrer">
                    Join Discussion
                  </Link>
                </Button>
              </div>
            </div>

            {/* Gallery Preview */}
            <div className="grid grid-cols-3 gap-3">
              {["bottles.jpg", "sinners.jpg", "paint n sip.jpg"].map((filename, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <Image
                    src={`/gallery/${filename}`} // Reference images correctly from public folder
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
        </main>

        {/* Footer */}
        <footer className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-green-200 dark:border-green-800">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} The Reading Circle
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Developed by{" "}
              <Link
                href="https://jumaportfolio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                Fred Juma
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

