"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { BookAIInsightsPopup } from "./book-ai-insights-popup"
import { useToast } from "@/components/ui/use-toast"

interface BookAIButtonProps {
  bookId: string
  bookTitle: string
  bookAuthor: string
  bookDescription?: string
}

export function BookAIButton({ bookId, bookTitle, bookAuthor, bookDescription }: BookAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleOpenAIInsights = async () => {
    setIsLoading(true)
    try {
      // We'll open the popup immediately and load the data inside the popup component
      setIsOpen(true)
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
      />
    </>
  )
}
