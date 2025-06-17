"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { BookAIInsightsPopup } from "./book-ai-insights-popup"
import { useToast } from "@/components/ui/use-toast"
import { getBookInsights } from "@/app/actions/book-ai-actions"

interface BookAIButtonProps {
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

interface BookCover {
  url: string | null
  loading: boolean
  error: boolean
}

type EnhancedRecommendation = BookInsights["recommendations"][0] & {
  cover?: BookCover
}

export function BookAIButton({ bookId, bookTitle, bookAuthor, bookDescription }: BookAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [insights, setInsights] = useState<BookInsights | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendationsWithCovers, setRecommendationsWithCovers] = useState<EnhancedRecommendation[]>([])
  const { toast } = useToast()

  const fetchInsights = async (isRegenerate = false) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log(`${isRegenerate ? "Regenerating" : "Fetching"} insights for: ${bookTitle} by ${bookAuthor}`)
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

      // Show success toast for regeneration
      if (isRegenerate) {
        toast({
          title: "Success",
          description: "AI insights have been regenerated successfully!",
        })
      }

      return data
    } catch (err: any) {
      console.error("Error fetching book insights:", err)
      const errorMessage = err?.message || "Failed to load AI insights. Please try again later."
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAIInsights = async () => {
    // If we already have insights, just open the popup
    if (insights) {
      setIsOpen(true)
      return
    }

    // Otherwise, fetch insights first
    setIsLoading(true)
    try {
      setIsOpen(true)
      await fetchInsights()
    } catch (error) {
      console.error("Error opening AI insights:", error)
      toast({
        title: "Error",
        description: "Failed to load AI insights. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerateInsights = async () => {
    await fetchInsights(true)
  }

  return (
    <>
      <Button
        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 font-serif group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={handleOpenAIInsights}
        disabled={isLoading}
      >
        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <Sparkles className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
        {isLoading ? "Loading..." : "Gladwell Insights"}
      </Button>

      <BookAIInsightsPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bookId={bookId}
        bookTitle={bookTitle}
        bookAuthor={bookAuthor}
        bookDescription={bookDescription}
        insights={insights}
        isLoading={isLoading}
        error={error}
        onRegenerate={handleRegenerateInsights}
        recommendationsWithCovers={recommendationsWithCovers}
        setRecommendationsWithCovers={setRecommendationsWithCovers}
      />
    </>
  )
}
