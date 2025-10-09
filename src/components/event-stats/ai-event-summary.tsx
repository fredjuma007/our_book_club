"use client"

import { useState, useEffect } from "react"
import { motion, type Variants } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { generateAIEventSummary } from "@/app/actions/event-stats-actions"

interface IEvent {
  _id: string
  title: string
  date: string
  time: string
  location: string
  type?: string
  description?: string
  moderators: string[]
  isPast?: boolean
  isOnline?: boolean
  [key: string]: any
}

interface AIEventSummaryProps {
  events: IEvent[]
}

export function AIEventSummary({ events }: AIEventSummaryProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [summary, setSummary] = useState<string>("")
  const [insights, setInsights] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)

    // Only generate summary if we have events
    if (events.length > 0) {
      generateSummary()
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
  const loadingTextColor = isDark ? "text-green-400" : "text-green-600"
  const errorTextColor = isDark ? "text-red-400" : "text-red-600"
  const buttonBgColor = isDark ? "bg-green-700" : "bg-green-600"
  const buttonHoverColor = isDark ? "hover:bg-green-800" : "hover:bg-green-700"

  // Generate AI summary based on event history
  const generateSummary = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Prepare event data for the AI
      const eventData = events.map((event) => ({
        title: event.title,
        date: event.date,
        type: event.type || "General",
        location: event.location,
        isOnline: event.isOnline,
        moderators: event.moderators,
      }))

      // Call the server action to generate summary
      const result = await generateAIEventSummary(eventData)

      if (result) {
        setSummary(result.summary)
        setInsights(result.insights)
        setRecommendations(result.recommendations)
      }
    } catch (err) {
      console.error("Error generating event summary:", err)
      setError("Failed to generate summary. Please try again later.")

      // Set fallback summary
      setSummary(
        "The Reading Circle has hosted a variety of events, including book discussions, author talks, and social gatherings. These events have been a mix of online and in-person formats, allowing members to connect regardless of location.",
      )
      setInsights([
        "Book discussions are the most common event type",
        "There's a good balance between online and in-person events",
        "Events are typically moderated by a core group of dedicated members",
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Sparkles className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>Gladwell AI Event Summary</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className={loadingTextColor}>Analyzing event history...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className={`${errorTextColor} mb-4`}>{error}</p>
          <Button onClick={generateSummary} className={`${buttonBgColor} ${buttonHoverColor} text-white`}>
            Try Again
          </Button>
        </div>
      ) : (
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Summary */}
          <motion.div
            className={`${itemBgColor} rounded-lg border ${itemBorderColor} p-4 ${itemHoverBgColor}`}
            variants={itemVariants}
          >
            <h4 className={`text-lg font-semibold mb-2 ${titleColor}`}>Summary</h4>
            <p className={`text-sm ${textColorSecondary}`}>{summary}</p>
          </motion.div>

          {/* Insights */}
          <motion.div
            className={`${itemBgColor} rounded-lg border ${itemBorderColor} p-4 ${itemHoverBgColor}`}
            variants={itemVariants}
          >
            <h4 className={`text-lg font-semibold mb-2 ${titleColor}`}>Key Insights</h4>
            <ul className="list-disc list-inside space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className={`text-sm ${textColorSecondary}`}>
                  {insight}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
