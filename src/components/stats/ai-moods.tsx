"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Smile, Frown, Brain } from "lucide-react"
import { useTheme } from "next-themes"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"

interface Book {
  _id?: string
  title?: string
  author?: string
  genre?: string
  description?: string
  [key: string]: any
}

interface AIMoodsProps {
  books: Book[]
}

// Mood categories and their descriptions
const moodCategories = [
  { name: "Uplifting", description: "Books that inspire and elevate spirits" },
  { name: "Thought-provoking", description: "Books that challenge perspectives and stimulate thinking" },
  { name: "Emotional", description: "Books that evoke strong feelings and emotional responses" },
  { name: "Suspenseful", description: "Books with tension and anticipation" },
  { name: "Humorous", description: "Books with comedy and wit" },
  { name: "Melancholic", description: "Books with a sense of thoughtful sadness" },
]

export function AIMoods({ books }: AIMoodsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [moodData, setMoodData] = useState<any[]>([])

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
    analyzeMoods()
  }, [])

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-blue-900/40 to-green-900/40" : "from-blue-100 to-green-100"
  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-500" : "text-green-700"
  const textColorSecondary = isDark ? "text-green-400/70" : "text-green-600/80"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const cardBgColor = isDark ? "bg-green-900/20" : "bg-white/80"
  const cardBorderColor = isDark ? "border-green-700/20" : "border-green-200"
  const radarColor = isDark ? "#10B981" : "#059669"
  const gridColor = isDark ? "#1e40af30" : "#e5e7eb"
  const axisTickColor = isDark ? "#10B981" : "#047857"

  // Analyze moods based on book genres, titles, and descriptions
  const analyzeMoods = () => {
    // This is a simplified mood analysis based on genres and keywords
    // In a real application, you might use NLP or a more sophisticated algorithm

    const genreMoodMap: Record<string, Record<string, number>> = {
      Mystery: { Suspenseful: 80, "Thought-provoking": 60 },
      Thriller: { Suspenseful: 90, Emotional: 50 },
      Romance: { Emotional: 85, Uplifting: 70 },
      "Science Fiction": { "Thought-provoking": 85, Suspenseful: 60 },
      Fantasy: { Uplifting: 70, "Thought-provoking": 65 },
      Horror: { Suspenseful: 95, Melancholic: 70 },
      Comedy: { Humorous: 95, Uplifting: 80 },
      Drama: { Emotional: 90, Melancholic: 75 },
      "Historical Fiction": { "Thought-provoking": 80, Melancholic: 60 },
      Biography: { "Thought-provoking": 75, Emotional: 65 },
      "Self-help": { Uplifting: 90, "Thought-provoking": 80 },
      Poetry: { Emotional: 85, Melancholic: 70 },
    }

    // Keywords that might indicate certain moods
    const keywordMoodMap: Record<string, Record<string, number>> = {
      laugh: { Humorous: 20, Uplifting: 15 },
      funny: { Humorous: 25, Uplifting: 10 },
      happy: { Uplifting: 20 },
      joy: { Uplifting: 25 },
      sad: { Melancholic: 25, Emotional: 15 },
      tragic: { Melancholic: 30, Emotional: 20 },
      exciting: { Suspenseful: 20, Uplifting: 15 },
      suspense: { Suspenseful: 30 },
      thriller: { Suspenseful: 25 },
      thought: { "Thought-provoking": 20 },
      perspective: { "Thought-provoking": 25 },
      emotional: { Emotional: 30 },
      feeling: { Emotional: 20 },
      melancholy: { Melancholic: 30 },
      reflective: { Melancholic: 20, "Thought-provoking": 15 },
    }

    // Initialize mood counts
    const moodCounts: Record<string, number> = {}
    moodCategories.forEach((category) => {
      moodCounts[category.name] = 0
    })

    // Analyze each book
    books.forEach((book) => {
      // Check genre
      if (book.genre && genreMoodMap[book.genre]) {
        const genreMoods = genreMoodMap[book.genre]
        Object.entries(genreMoods).forEach(([mood, value]) => {
          moodCounts[mood] = (moodCounts[mood] || 0) + value
        })
      }

      // Check title and description for keywords
      const textToAnalyze = `${book.title || ""} ${book.description || ""}`.toLowerCase()

      Object.entries(keywordMoodMap).forEach(([keyword, moods]) => {
        if (textToAnalyze.includes(keyword)) {
          Object.entries(moods).forEach(([mood, value]) => {
            moodCounts[mood] = (moodCounts[mood] || 0) + value
          })
        }
      })
    })

    // Normalize values to 0-100 scale
    const maxValue = Math.max(...Object.values(moodCounts), 1)
    const normalizedMoods = Object.entries(moodCounts).map(([name, value]) => ({
      subject: name,
      A: Math.min(Math.round((value / maxValue) * 100), 100),
      fullMark: 100,
    }))

    setMoodData(normalizedMoods)
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Brain className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>AI Mood Analysis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={moodData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: axisTickColor }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: axisTickColor }} />
              <Radar name="Reading Mood" dataKey="A" stroke={radarColor} fill={radarColor} fillOpacity={0.6} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderColor: "#10B981",
                  color: isDark ? "#ffffff" : "#000000",
                }}
                formatter={(value) => [`${value}%`, "Mood Intensity"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-1">
          <div className="space-y-3">
            <h4 className={`font-serif font-bold ${textColor} mb-2`}>Mood Insights</h4>

            <div className={`${cardBgColor} rounded-lg p-3 border ${cardBorderColor}`}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-green-600" />
                <h5 className={`font-medium ${textColor}`}>Club Reading Personality</h5>
              </div>
              <p className={`text-sm ${textColorSecondary}`}>
                Your club tends to enjoy {getTopMoods(moodData, 2).join(" and ")} books, suggesting a preference for
                engaging and impactful reading experiences.
              </p>
            </div>

            <div className={`${cardBgColor} rounded-lg p-3 border ${cardBorderColor}`}>
              <div className="flex items-center gap-2 mb-1">
                <Smile className="w-4 h-4 text-green-600" />
                <h5 className={`font-medium ${textColor}`}>Strongest Mood</h5>
              </div>
              <p className={`text-sm ${textColorSecondary}`}>
                {getTopMoods(moodData, 1)[0]} ({getTopMoodValue(moodData)}%) is your club's dominant reading mood,
                reflecting your collective preference.
              </p>
            </div>

            <div className={`${cardBgColor} rounded-lg p-3 border ${cardBorderColor}`}>
              <div className="flex items-center gap-2 mb-1">
                <Frown className="w-4 h-4 text-green-600" />
                <h5 className={`font-medium ${textColor}`}>Mood Gap</h5>
              </div>
              <p className={`text-sm ${textColorSecondary}`}>
                Consider exploring more {getBottomMoods(moodData, 1)[0]} books to diversify your reading experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Helper functions to get top and bottom moods
function getTopMoods(moodData: any[], count: number): string[] {
  return [...moodData]
    .sort((a, b) => b.A - a.A)
    .slice(0, count)
    .map((item) => item.subject)
}

function getBottomMoods(moodData: any[], count: number): string[] {
  return [...moodData]
    .sort((a, b) => a.A - b.A)
    .slice(0, count)
    .map((item) => item.subject)
}

function getTopMoodValue(moodData: any[]): number {
  const sorted = [...moodData].sort((a, b) => b.A - a.A)
  return sorted.length > 0 ? sorted[0].A : 0
}
