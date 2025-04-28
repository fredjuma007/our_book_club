"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"

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

interface EventTimelineProps {
  events: IEvent[]
}

export function EventTimeline({ events }: EventTimelineProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [timeframeType, setTimeframeType] = useState<"month" | "year">("month")

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Process timeline data
  const eventsByTimeframe: Record<string, number> = {}

  events.forEach((event) => {
    if (event.date) {
      const date = new Date(event.date)
      let timeframeKey: string

      if (timeframeType === "month") {
        // Format: "Jan 2023"
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        timeframeKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      } else {
        // Format: "2023"
        timeframeKey = `${date.getFullYear()}`
      }

      eventsByTimeframe[timeframeKey] = (eventsByTimeframe[timeframeKey] || 0) + 1
    }
  })

  // Create sorted timeline data
  const timelineData = Object.entries(eventsByTimeframe)
    .map(([timeframe, count]) => ({
      timeframe,
      count,
    }))
    .sort((a, b) => {
      // For year sorting
      if (timeframeType === "year") {
        return Number.parseInt(a.timeframe) - Number.parseInt(b.timeframe)
      }

      // For month sorting, we need to parse the month and year
      const [aMonth, aYear] = a.timeframe.split(" ")
      const [bMonth, bYear] = b.timeframe.split(" ")

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const aMonthIndex = monthNames.indexOf(aMonth)
      const bMonthIndex = monthNames.indexOf(bMonth)

      if (aYear !== bYear) {
        return Number.parseInt(aYear) - Number.parseInt(bYear)
      }
      return aMonthIndex - bMonthIndex
    })

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-green-800/20" : "from-green-100 to-green-50"

  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-500" : "text-green-700"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const gridColor = isDark ? "#1e40af30" : "#e5e7eb"
  const axisTickColor = isDark ? "#10B981" : "#047857"
  const tooltipBgColor = isDark ? "#0f172a" : "#ffffff"
  const tooltipBorderColor = isDark ? "#10B981" : "#10B981"
  const tooltipTextColor = isDark ? "#ffffff" : "#000000"
  const barColor = isDark ? "#10B981" : "#059669"
  const buttonBgActive = isDark ? "bg-green-700" : "bg-green-600"
  const buttonBgInactive = isDark ? "bg-gray-700" : "bg-gray-200"
  const buttonTextActive = "text-white"
  const buttonTextInactive = isDark ? "text-gray-300" : "text-gray-600"

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`${iconBgColor} p-2 rounded-full`}>
            <Calendar className={`w-5 h-5 ${textColor}`} />
          </div>
          <h3 className={`text-xl font-serif font-bold ${textColor}`}>Events Timeline</h3>
        </div>

        <div className="flex rounded-md overflow-hidden">
          <button
            onClick={() => setTimeframeType("month")}
            className={`px-3 py-1 text-sm font-medium ${
              timeframeType === "month"
                ? buttonBgActive + " " + buttonTextActive
                : buttonBgInactive + " " + buttonTextInactive
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframeType("year")}
            className={`px-3 py-1 text-sm font-medium ${
              timeframeType === "year"
                ? buttonBgActive + " " + buttonTextActive
                : buttonBgInactive + " " + buttonTextInactive
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="timeframe"
              tick={{ fill: axisTickColor, fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: axisTickColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBgColor,
                borderColor: tooltipBorderColor,
                color: tooltipTextColor,
              }}
              formatter={(value) => [`${value} events`, ""]}
            />
            <Bar dataKey="count" fill={barColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
