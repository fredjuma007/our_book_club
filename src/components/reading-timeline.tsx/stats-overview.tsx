"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Book, Clock, BookOpen } from "lucide-react"

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

  useEffect(() => {
    setIsVisible(true)
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
        className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-6 border border-green-700/30 shadow-lg backdrop-blur-sm"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-green-700/30 p-3 rounded-full">
            <Book className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-xl font-serif font-bold text-green-500">Total Books</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{totalBooks}</span>
          <span className="text-green-400/80 mb-1">books read</span>
        </div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-6 border border-green-700/30 shadow-lg backdrop-blur-sm"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-green-700/30 p-3 rounded-full">
            <BookOpen className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-xl font-serif font-bold text-green-500">Total Pages</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{totalPages.toLocaleString()}</span>
          <span className="text-green-400/80 mb-1">pages read</span>
        </div>
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-6 border border-green-700/30 shadow-lg backdrop-blur-sm"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-green-700/30 p-3 rounded-full">
            <Clock className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-xl font-serif font-bold text-green-500">Reading Time</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-white">{readingHours.toFixed(1)}</span>
          <span className="text-green-400/80 mb-1">estimated hours</span>
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
