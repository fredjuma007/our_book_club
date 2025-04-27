"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, BookOpen, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateAIRecommendations } from "@/app/actions/stats-actions"
import { useTheme } from "next-themes"

interface Book {
  _id?: string
  title?: string
  author?: string
  genre?: string
  [key: string]: any
}

interface Review {
  _id?: string
  bookId?: string
  rating?: number
  [key: string]: any
}

interface AIRecommendationsProps {
  books: Book[]
  reviews: Review[]
}

interface Recommendation {
  title: string
  author: string
  reason: string
}

export function AIRecommendations({ books, reviews }: AIRecommendationsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)

    // Only generate recommendations if we have books
    if (books.length > 0) {
      generateRecommendations()
    }
  }, [])

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-purple-900/40 to-green-900/40" : "from-purple-100 to-green-100"

  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-500" : "text-green-700"
  const textColorSecondary = isDark ? "text-green-400/70" : "text-green-600/80"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const itemBgColor = isDark ? "bg-green-900/20" : "bg-white/80"
  const itemBorderColor = isDark ? "border-green-700/20" : "border-green-200"
  const itemHoverBgColor = isDark ? "hover:bg-green-900/30" : "hover:bg-green-50/80"
  const titleColor = isDark ? "text-green-400" : "text-green-700"
  const authorColor = isDark ? "text-green-400/70" : "text-green-600/80"
  const reasonColor = isDark ? "text-green-300/90" : "text-green-700/90"
  const buttonBorderColor = isDark ? "border-green-700/50" : "border-green-500/50"
  const buttonTextColor = isDark ? "text-green-400" : "text-green-600"
  const buttonHoverBgColor = isDark ? "hover:bg-green-700/20" : "hover:bg-green-100"
  const loadingTextColor = isDark ? "text-green-400" : "text-green-600"
  const errorTextColor = isDark ? "text-red-400" : "text-red-600"
  const buttonBgColor = isDark ? "bg-green-700" : "bg-green-600"
  const buttonHoverColor = isDark ? "hover:bg-green-800" : "hover:bg-green-700"

  // Generate AI recommendations based on reading history
  const generateRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get top genres
      const genreCounts: Record<string, number> = {}
      books.forEach((book) => {
        const genre = book.genre || "Unknown"
        genreCounts[genre] = (genreCounts[genre] || 0) + 1
      })

      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genre]) => genre)

      // Get top authors
      const authorCounts: Record<string, number> = {}
      books.forEach((book) => {
        const author = book.author || "Unknown"
        authorCounts[author] = (authorCounts[author] || 0) + 1
      })

      const topAuthors = Object.entries(authorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([author]) => author)

      // Get recent books
      const recentBooks = [...books]
        .sort((a, b) => {
          const dateA = a._createdDate ? new Date(a._createdDate).getTime() : 0
          const dateB = b._createdDate ? new Date(b._createdDate).getTime() : 0
          return dateB - dateA
        })
        .slice(0, 5)
        .map((book) => `${book.title} by ${book.author}`)

      // Call the server action to generate recommendations
      const aiRecommendations = await generateAIRecommendations(topGenres, topAuthors, recentBooks)
      setRecommendations(aiRecommendations)
    } catch (err) {
      console.error("Error generating recommendations:", err)
      setError("Failed to generate recommendations. Please try again later.")

      // Set fallback recommendations
      setRecommendations([
        {
          title: "The Midnight Library",
          author: "Matt Haig",
          reason: "A philosophical novel about life's possibilities and choices.",
        },
        {
          title: "Circe",
          author: "Madeline Miller",
          reason: "A mythological retelling with rich character development.",
        },
        {
          title: "The Seven Husbands of Evelyn Hugo",
          author: "Taylor Jenkins Reid",
          reason: "A compelling story about a Hollywood icon with complex characters.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Sparkles className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>AI Book Recommendations</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className={loadingTextColor}>Generating personalized recommendations...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className={errorTextColor + " mb-4"}>{error}</p>
          <Button onClick={generateRecommendations} className={`${buttonBgColor} ${buttonHoverColor} text-white`}>
            Try Again
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              className={`${itemBgColor} rounded-lg p-5 border ${itemBorderColor} backdrop-blur-sm ${itemHoverBgColor} transition-colors`}
              variants={itemVariants}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`${iconBgColor} p-2 rounded-full mt-1`}>
                  <BookOpen className={`w-4 h-4 ${textColor}`} />
                </div>
                <div>
                  <h4 className={`font-serif font-bold ${titleColor}`}>{rec.title}</h4>
                  <p className={`${authorColor} text-sm`}>by {rec.author}</p>
                </div>
              </div>
              <p className={`${reasonColor} text-sm ml-11`}>{rec.reason}</p>
              <div className="mt-4 ml-11">
                <Button
                  variant="outline"
                  size="sm"
                  className={`${buttonBorderColor} ${buttonTextColor} ${buttonHoverBgColor}`}
                  onClick={() =>
                    window.open(
                      `https://www.goodreads.com/search?q=${encodeURIComponent(`${rec.title} ${rec.author}`)}`,
                      "_blank",
                    )
                  }
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
