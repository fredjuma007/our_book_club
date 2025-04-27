"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { BookText } from "lucide-react"
import { useTheme } from "next-themes"

interface Book {
  _id?: string
  title?: string
  author?: string
  genre?: string
  [key: string]: any
}

interface GenreDistributionProps {
  books: Book[]
}

export function GenreDistribution({ books }: GenreDistributionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Process genre data
  const genreCounts: Record<string, number> = {}

  books.forEach((book) => {
    const genre = book.genre || "Unknown"
    genreCounts[genre] = (genreCounts[genre] || 0) + 1
  })

  // Convert to array for chart
  const genreData = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Colors for the bars - more distinct in both themes
  const colors = isDark
    ? ["#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#047C4F", "#10A56C", "#0F9B63", "#0E8C5A", "#0D7D51"]
    : ["#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#047C4F", "#10A56C", "#0F9B63", "#0E8C5A", "#0D7D51"]

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-green-800/20" : "from-green-100 to-green-50"

  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-500" : "text-green-700"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const tooltipBgColor = isDark ? "#0f172a" : "#ffffff"
  const tooltipBorderColor = isDark ? "#10B981" : "#10B981"
  const tooltipTextColor = isDark ? "#ffffff" : "#000000"
  const axisTickColor = isDark ? "#10B981" : "#047857"

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <BookText className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>Genre Distribution</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={genreData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: axisTickColor, fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fill: axisTickColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBgColor,
                borderColor: tooltipBorderColor,
                color: tooltipTextColor,
                fontFamily: "serif",
              }}
              labelStyle={{ color: tooltipBorderColor, fontWeight: "bold" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {genreData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
