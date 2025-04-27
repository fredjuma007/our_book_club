"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Book, Clock, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"

interface IBook {
  _id?: string
  title?: string
  author?: string
  genre?: string
  pageCount?: number
  _createdDate?: string
  [key: string]: any
}

interface Review {
  _id?: string
  bookId?: string
  rating?: number
  [key: string]: any
}

interface StatsOverviewProps {
  books: IBook[]
  reviews: Review[]
}

export function StatsOverview({ books, reviews }: StatsOverviewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Calculate stats
  const totalBooks = books.length

  // Calculate total pages (if pageCount is available)
  const totalPages = books.reduce((sum, book) => {
    const pageCount = book.pageCount || estimatePageCount(book.title || "")
    return sum + pageCount
  }, 0)

  // Estimate reading hours (average reading speed: 30 pages per hour)
  const readingHours = totalPages / 30

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-green-800/20" : "from-green-100 to-green-50"

  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-400" : "text-green-700"
  const textColorSecondary = isDark ? "text-green-400/80" : "text-green-600/80"
  const headingColor = isDark ? "text-green-500" : "text-green-700"
  const valueColor = isDark ? "text-white" : "text-green-800"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <motion.div
        className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <Book className={`w-6 h-6 ${headingColor}`} />
          </div>
          <h3 className={`text-xl font-serif font-bold ${headingColor}`}>Total Books</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${valueColor}`}>{totalBooks}</span>
          <span className={`${textColorSecondary} mb-1`}>books read</span>
        </div>
      </motion.div>

      <motion.div
        className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <BookOpen className={`w-6 h-6 ${headingColor}`} />
          </div>
          <h3 className={`text-xl font-serif font-bold ${headingColor}`}>Total Pages</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${valueColor}`}>{totalPages.toLocaleString()}</span>
          <span className={`${textColorSecondary} mb-1`}>pages read</span>
        </div>
      </motion.div>

      <motion.div
        className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <Clock className={`w-6 h-6 ${headingColor}`} />
          </div>
          <h3 className={`text-xl font-serif font-bold ${headingColor}`}>Reading Time</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${valueColor}`}>{readingHours.toFixed(1)}</span>
          <span className={`${textColorSecondary} mb-1`}>estimated hours</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Helper function to estimate page count based on title length if not provided
function estimatePageCount(title: string): number {
  // This is just a placeholder function that returns a random page count
  // In a real app, you might want to use an API or database to get actual page counts
  const baseCount = 250
  const variance = title.length * 2
  return baseCount + variance
}
