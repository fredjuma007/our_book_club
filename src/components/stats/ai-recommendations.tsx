"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, BookOpen, ExternalLink, RefreshCw } from "lucide-react"
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

interface BookCover {
  url: string | null
  loading: boolean
  error: boolean
}

type EnhancedRecommendation = Recommendation & {
  cover?: BookCover
}

// Function to get book cover from Open Library
async function getOpenLibraryCover(title: string, author: string): Promise<string | null> {
  try {
    // Search for the book
    const searchQuery = encodeURIComponent(`${title} ${author}`)
    const searchResponse = await fetch(`https://openlibrary.org/search.json?q=${searchQuery}&limit=1`)
    const searchData = await searchResponse.json()

    if (searchData.docs && searchData.docs.length > 0) {
      const book = searchData.docs[0]
      if (book.cover_i) {
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching from Open Library:", error)
    return null
  }
}

// Function to get book cover from Google Books
async function getGoogleBooksCover(title: string, author: string): Promise<string | null> {
  try {
    const searchQuery = encodeURIComponent(`${title} ${author}`)
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=1`)
    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const book = data.items[0]
      if (book.volumeInfo?.imageLinks?.thumbnail) {
        // Convert to higher resolution if available
        return book.volumeInfo.imageLinks.thumbnail.replace("zoom=1", "zoom=2")
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching from Google Books:", error)
    return null
  }
}

// Function to get book cover with fallback
async function getBookCover(title: string, author: string): Promise<string | null> {
  // Try Open Library first
  let coverUrl = await getOpenLibraryCover(title, author)

  // If Open Library fails, try Google Books
  if (!coverUrl) {
    coverUrl = await getGoogleBooksCover(title, author)
  }

  return coverUrl
}

export function AIRecommendations({ books, reviews }: AIRecommendationsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [recommendationsWithCovers, setRecommendationsWithCovers] = useState<EnhancedRecommendation[]>([])
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

  // Fetch book covers when recommendations change
  useEffect(() => {
    if (recommendations.length > 0) {
      fetchBookCovers(recommendations)
    }
  }, [recommendations])

  const fetchBookCovers = async (recs: Recommendation[]) => {
    if (!recs || recs.length === 0) return

    // Initialize recommendations with loading state
    const initialRecommendations: EnhancedRecommendation[] = recs.map((rec) => ({
      ...rec,
      cover: { url: null, loading: true, error: false },
    }))

    setRecommendationsWithCovers(initialRecommendations)

    // Fetch covers for each recommendation
    const updatedRecommendations = await Promise.all(
      recs.map(async (rec) => {
        try {
          const coverUrl = await getBookCover(rec.title, rec.author)
          return {
            ...rec,
            cover: { url: coverUrl, loading: false, error: !coverUrl },
          }
        } catch (error) {
          console.error(`Error fetching cover for ${rec.title}:`, error)
          return {
            ...rec,
            cover: { url: null, loading: false, error: true },
          }
        }
      }),
    )

    setRecommendationsWithCovers(updatedRecommendations)
  }

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
      const fallbackRecs = [
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
      ]
      setRecommendations(fallbackRecs)
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

  const displayRecommendations =
    recommendationsWithCovers.length > 0
      ? recommendationsWithCovers
      : recommendations.map((rec) => ({ ...rec, cover: undefined }))

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
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>Gladwell AI Book Recommendations</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className={loadingTextColor}>Generating Gladwell AI recommendations...</p>
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
          {displayRecommendations.map((rec, index) => (
            <motion.div
              key={index}
              className={`${itemBgColor} rounded-lg p-5 border ${itemBorderColor} backdrop-blur-sm ${itemHoverBgColor} transition-colors`}
              variants={itemVariants}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <div className="relative w-12 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-md shadow-sm overflow-hidden border border-green-700/20">
                    {rec.cover?.loading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-green-600 animate-spin" />
                      </div>
                    ) : rec.cover?.url ? (
                      <img
                        src={rec.cover.url || "/placeholder.svg"}
                        alt={`Cover of ${rec.title}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide broken image and show fallback
                          e.currentTarget.style.display = "none"
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = "flex"
                        }}
                      />
                    ) : null}
                    {/* Fallback when no cover or error */}
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center text-center p-1 ${rec.cover?.url ? "hidden" : "flex"}`}
                      style={{ display: rec.cover?.url ? "none" : "flex" }}
                    >
                      <BookOpen className="w-4 h-4 text-green-600 mb-1" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-serif font-bold ${titleColor} leading-tight`}>{rec.title}</h4>
                  <p className={`${authorColor} text-sm`}>by {rec.author}</p>
                </div>
              </div>
              <p className={`${reasonColor} text-sm mb-4`}>{rec.reason}</p>
              <div className="flex justify-end">
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
                  <ExternalLink className="w-3 h-3 mr-1" />
                  <span>Add to Goodreads</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
