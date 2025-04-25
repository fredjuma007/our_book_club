"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  BookOpen,
  Quote,
  User,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  Gauge,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBookInsights } from "@/app/actions/book-ai-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useMediaQuery } from "@/hooks/use-media-query"

interface BookAIInsightsPopupProps {
  isOpen: boolean
  onClose: () => void
  bookId: string
  bookTitle: string
  bookAuthor: string
  bookDescription?: string
}

// Match the interface from the server action
interface BookInsights {
  summary: string
  quotes: string[]
  authorBio: string
  themes: string[]
  discussionQuestions: string[]
  moodTone: {
    fun: number
    serious: number
    dark: number
    light: number
    emotional: number
    intellectual: number
  }
  recommendations: {
    title: string
    author: string
    reason: string
  }[]
}

export function BookAIInsightsPopup({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  bookAuthor,
  bookDescription,
}: BookAIInsightsPopupProps) {
  const [insights, setInsights] = useState<BookInsights | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("summary")
  const isMobile = useMediaQuery("(max-width: 640px)")

  const fetchInsights = async () => {
    if (!isOpen) return

    setIsLoading(true)
    setError(null)

    try {
      console.log(`Fetching insights for: ${bookTitle} by ${bookAuthor}`)
      const data = await getBookInsights(bookId, bookTitle, bookAuthor, bookDescription || "")
      console.log("Insights received:", data ? "success" : "failed")

      // Additional validation to ensure we don't display file content
      if (data) {
        // Clean any potential file content from summary
        if (
          data.summary &&
          (data.summary.includes("Attachment") ||
            data.summary.includes("URL:") ||
            data.summary.includes("use server") ||
            data.summary.includes("import {"))
        ) {
          data.summary = "Summary not available. Please try again."
        }

        // Clean themes
        if (data.themes) {
          data.themes = data.themes.filter(
            (theme) =>
              !theme.includes("Attachment") &&
              !theme.includes("URL:") &&
              !theme.includes("use server") &&
              !theme.includes("import {") &&
              !theme.includes("function") &&
              !theme.includes("interface") &&
              theme.length < 100, // Themes length check
          )
        }

        // Ensure recommendations have proper data and styling
        if (data.recommendations) {
          data.recommendations = data.recommendations.map((rec) => ({
            title:
              rec.title && typeof rec.title === "string" && !rec.title.includes("function")
                ? rec.title
                : `Book similar to ${bookTitle}`,
            author:
              rec.author && typeof rec.author === "string" && !rec.author.includes("function")
                ? rec.author
                : "Recommended Author",
            reason:
              rec.reason && typeof rec.reason === "string" && !rec.reason.includes("function")
                ? rec.reason
                : `For fans of ${bookAuthor}'s writing style.`,
          }))
        }
      }

      setInsights(data)
    } catch (err: any) {
      console.error("Error fetching book insights:", err)
      setError(err?.message || "Failed to load AI insights. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [isOpen, bookId, bookTitle, bookAuthor, bookDescription])

  // Helper function to safely render text content
  const renderSafeContent = (content: string) => {
    if (!content) return "Not available"

    // Check if content looks like code or file content
    if (
      content.includes("Attachment") ||
      content.includes("URL:") ||
      content.includes("use server") ||
      content.includes("import {") ||
      content.includes("function") ||
      content.includes("interface") ||
      content.includes("export") ||
      content.includes("const ") ||
      content.includes("let ") ||
      content.includes("class ")
    ) {
      return "Content not available. Please try again."
    }

    // Clean up any HTML or markdown that might be in the content
    const cleanedContent = content
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/```[^`]*```/g, "") // Remove code blocks
      .replace(/\[.*?\]$$.*?$$/g, "") // Remove markdown links

    return cleanedContent
  }

  // Function to navigate between tabs on mobile
  const navigateTab = (direction: "next" | "prev") => {
    const tabs = ["summary", "quotes", "author", "themes", "questions", "recommendations"]
    const currentIndex = tabs.indexOf(activeTab)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % tabs.length
    } else {
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length
    }

    setActiveTab(tabs[newIndex])
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-green-700"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <h3 className="font-serif font-bold text-sm sm:text-lg truncate">Gladwell Insights: {bookTitle}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-3 sm:p-6" style={{ maxHeight: "calc(95vh - 120px)" }}>
              {isLoading ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex justify-center items-center mb-4 sm:mb-8">
                    <div className="relative">
                      <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 animate-spin" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 dark:text-gray-400 font-serif text-sm sm:text-base mb-4 sm:mb-8">
                    Generating AI insights for "{bookTitle}" by {bookAuthor}...
                  </p>
                  <div className="space-y-2">
                    <Skeleton className="h-5 sm:h-6 w-1/3" />
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 sm:h-6 w-1/3" />
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-full" />
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-4 sm:py-8 space-y-3 sm:space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                  <p className="text-gray-600 dark:text-gray-400 font-serif text-sm sm:text-base">
                    The AI model may have returned an invalid response. Please try again.
                  </p>
                  <div className="flex justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                    <Button
                      onClick={fetchInsights}
                      className="bg-green-700 hover:bg-green-800 text-white font-serif text-xs sm:text-sm"
                    >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Try Again
                    </Button>
                    <Button
                      onClick={onClose}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-serif text-xs sm:text-sm"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : insights ? (
                <div className="w-full">
                  {/* Mobile Tab Navigation */}
                  {isMobile && (
                    <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-900 p-2 rounded-lg border border-green-700/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateTab("prev")}
                        className="p-1 h-8"
                        aria-label="Previous tab"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <h3 className="font-serif font-medium text-sm text-green-800 dark:text-green-400 capitalize">
                        {activeTab}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateTab("next")}
                        className="p-1 h-8"
                        aria-label="Next tab"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Desktop Tabs */}
                  <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {!isMobile && (
                      <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4 sm:mb-6 overflow-x-auto">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="quotes">Quotes</TabsTrigger>
                        <TabsTrigger value="author">Author</TabsTrigger>
                        <TabsTrigger value="themes">Themes</TabsTrigger>
                        <TabsTrigger value="questions">Questions</TabsTrigger>
                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                      </TabsList>
                    )}

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="space-y-4 sm:space-y-6 mt-0">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-green-700/30 shadow-inner">
                        <h4 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400 font-serif mb-2 sm:mb-3 flex items-center">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-700" />
                          AI-Generated Summary
                        </h4>
                        <div className="text-gray-700 dark:text-gray-300 font-serif prose prose-sm sm:prose-base prose-green dark:prose-invert max-w-none">
                          {insights.summary.split("\n").map((paragraph, i) => (
                            <p key={i} className="text-sm sm:text-base">
                              {renderSafeContent(paragraph)}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Mood/Tone Meter */}
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-green-700/30 shadow-inner">
                        <h4 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400 font-serif mb-2 sm:mb-3 flex items-center">
                          <Gauge className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-700" />
                          Mood & Tone Analysis
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs sm:text-sm font-serif">
                              <span>Fun</span>
                              <span>Serious</span>
                            </div>
                            <Progress value={insights.moodTone.fun} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{insights.moodTone.fun}%</span>
                              <span>{100 - insights.moodTone.fun}%</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs sm:text-sm font-serif">
                              <span>Light</span>
                              <span>Dark</span>
                            </div>
                            <Progress value={insights.moodTone.light} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{insights.moodTone.light}%</span>
                              <span>{100 - insights.moodTone.light}%</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs sm:text-sm font-serif">
                              <span>Emotional</span>
                              <span>Intellectual</span>
                            </div>
                            <Progress value={insights.moodTone.emotional} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{insights.moodTone.emotional}%</span>
                              <span>{100 - insights.moodTone.emotional}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Quotes Tab */}
                    <TabsContent value="quotes" className="space-y-4 mt-0">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-green-700/30 shadow-inner">
                        <h4 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400 font-serif mb-2 sm:mb-3 flex items-center">
                          <Quote className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-700" />
                          Famous Quotes
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                          {insights.quotes && insights.quotes.length > 0 ? (
                            insights.quotes.map((quote, index) => (
                              <div
                                key={index}
                                className="relative pl-5 sm:pl-6 py-2 sm:py-3 italic font-serif text-sm sm:text-base text-gray-700 dark:text-gray-300 border-l-4 border-green-700/30 bg-green-50/50 dark:bg-green-900/10 rounded-r-md"
                              >
                                <Quote className="absolute left-1 sm:left-2 top-2 sm:top-3 w-3 h-3 sm:w-4 sm:h-4 text-green-700/50" />
                                {renderSafeContent(quote)}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400 font-serif text-sm sm:text-base">
                              No quotes available.
                            </p>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Author Tab */}
                    <TabsContent value="author" className="space-y-4 mt-0">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-green-700/30 shadow-inner">
                        <h4 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400 font-serif mb-2 sm:mb-3 flex items-center">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-700" />
                          About {bookAuthor}
                        </h4>
                        <div className="text-gray-700 dark:text-gray-300 font-serif prose prose-sm sm:prose-base prose-green dark:prose-invert max-w-none">
                          {insights.authorBio.split("\n").map((paragraph, i) => (
                            <p key={i} className="text-sm sm:text-base">
                              {renderSafeContent(paragraph)}
                            </p>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Themes Tab */}
                    <TabsContent value="themes" className="space-y-4 mt-0">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-green-700/30 shadow-inner">
                        <h4 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400 font-serif mb-2 sm:mb-3 flex items-center">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-700" />
                          Themes & Tropes
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {insights.themes && insights.themes.length > 0 ? (
                            insights.themes.map((theme, index) => (
                              <span
                                key={index}
                                className="px-2 sm:px-3 py-1 sm:py-2 bg-green-700/10 text-green-800 dark:text-green-400 rounded-full text-xs sm:text-sm font-serif border border-green-700/30 hover:bg-green-700/20 transition-colors"
                              >
                                {renderSafeContent(theme)}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400 font-serif text-sm sm:text-base">
                              No themes available.
                            </p>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Questions Tab */}
                    <TabsContent value="questions" className="space-y-4 mt-0">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-green-700/30 shadow-inner">
                        <h4 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400 font-serif mb-2 sm:mb-3 flex items-center">
                          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-700" />
                          Discussion Questions
                        </h4>
                        {insights.discussionQuestions && insights.discussionQuestions.length > 0 ? (
                          <ol className="list-decimal pl-4 sm:pl-5 space-y-2 sm:space-y-4 font-serif text-gray-700 dark:text-gray-300">
                            {insights.discussionQuestions.map((question, index) => (
                              <li
                                key={index}
                                className="pl-1 sm:pl-2 py-1 text-sm sm:text-base hover:bg-green-50/50 dark:hover:bg-green-900/10 rounded transition-colors"
                              >
                                {renderSafeContent(question)}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 font-serif text-sm sm:text-base">
                            No discussion questions available.
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    {/* Recommendations Tab */}
                    <TabsContent value="recommendations" className="space-y-4 mt-0">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-green-700/30 shadow-inner">
                        <h4 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-400 font-serif mb-2 sm:mb-3 flex items-center">
                          <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-green-700" />
                          If You Liked This, You'll Like...
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                          {insights.recommendations &&
                          Array.isArray(insights.recommendations) &&
                          insights.recommendations.length > 0 ? (
                            insights.recommendations.map((rec, index) => (
                              <div
                                key={index}
                                className="bg-white dark:bg-gray-800 border border-green-700/20 rounded-lg p-2 sm:p-4 mb-2 sm:mb-4 last:mb-0 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-colors"
                              >
                                <h5 className="font-bold text-green-800 dark:text-green-400 font-serif text-base sm:text-lg">
                                  {renderSafeContent(rec.title)}
                                </h5>
                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
                                  by {renderSafeContent(rec.author)}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 font-serif text-sm sm:text-base mt-1">
                                  {renderSafeContent(rec.reason)}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="bg-white dark:bg-gray-800 border border-green-700/20 rounded-lg p-3 sm:p-4">
                              <p className="text-gray-700 dark:text-gray-300 font-serif text-sm sm:text-base">
                                No recommendations available.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-4 sm:py-8">
                  <p className="text-gray-500 dark:text-gray-400 font-serif text-sm sm:text-base">
                    No insights available for this book.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-green-700/20 p-2 sm:p-4 bg-white dark:bg-gray-900 flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-serif">
                AI-generated insights may not be 100% accurate.
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-serif text-xs sm:text-sm py-1 h-8 sm:h-10"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
