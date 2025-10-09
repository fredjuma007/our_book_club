"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Award } from "lucide-react"
import { useTheme } from "next-themes"

interface Book {
  _id?: string
  title?: string
  author?: string
  [key: string]: any
}

interface AuthorStatsProps {
  books: Book[]
}

export function AuthorStats({ books }: AuthorStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Process author data
  const authorCounts: Record<string, number> = {}
  const authorBooks: Record<string, string[]> = {}

  books.forEach((book) => {
    const author = book.author || "Unknown Author"
    authorCounts[author] = (authorCounts[author] || 0) + 1

    if (!authorBooks[author]) {
      authorBooks[author] = []
    }
    if (book.title) {
      authorBooks[author].push(book.title)
    }
  })

  // Get top authors
  const topAuthors = Object.entries(authorCounts)
    .map(([name, count]) => ({
      name,
      count,
      books: authorBooks[name] || [],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-green-800/20" : "from-green-100 to-green-50"

  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-500" : "text-green-700"
  const textColorSecondary = isDark ? "text-green-400/70" : "text-green-600/80"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const itemBgColor = isDark ? "bg-green-900/20" : "bg-white/80"
  const itemBorderColor = isDark ? "border-green-700/20" : "border-green-200"
  const countBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const countTextColor = isDark ? "text-green-300" : "text-green-700"

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <User className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>Most Read Authors</h3>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {topAuthors.map((author, index) => (
          <motion.div
            key={author.name}
            className={`${itemBgColor} rounded-lg p-4 border ${itemBorderColor}`}
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {index === 0 && (
                  <div className="text-yellow-500">
                    <Award className="w-5 h-5" />
                  </div>
                )}
                <h4 className={`font-serif font-bold ${textColor}`}>{author.name}</h4>
              </div>
              <span className={`${countBgColor} px-2 py-1 rounded text-sm ${countTextColor}`}>
                {author.count} {author.count === 1 ? "book" : "books"}
              </span>
            </div>
            <div className={`mt-2 text-sm ${textColorSecondary}`}>
              <span className="font-medium">Titles:</span> {author.books.join(", ")}
            </div>
          </motion.div>
        ))}

        {topAuthors.length === 0 && <div className="text-center py-8 text-green-400/70">No author data available</div>}
      </motion.div>
    </motion.div>
  )
}
