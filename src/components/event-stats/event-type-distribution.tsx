"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Tag } from "lucide-react"
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

interface EventTypeDistributionProps {
  events: IEvent[]
}

export function EventTypeDistribution({ events }: EventTypeDistributionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Process event type data
  const typeCounts: Record<string, number> = {}

  events.forEach((event) => {
    const type = event.type || "General"
    typeCounts[type] = (typeCounts[type] || 0) + 1
  })

  // Convert to array for chart
  const typeData = Object.entries(typeCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Colors for the pie chart
  const COLORS = [
    "#10B981", // green-500
    "#3B82F6", // blue-500
    "#F59E0B", // amber-500
    "#8B5CF6", // violet-500
    "#EC4899", // pink-500
    "#06B6D4", // cyan-500
    "#F97316", // orange-500
    "#14B8A6", // teal-500
    "#6366F1", // indigo-500
    "#D946EF", // fuchsia-500
  ]

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-green-800/20" : "from-green-100 to-green-50"
  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-500" : "text-green-700"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const tooltipBgColor = isDark ? "#0f172a" : "#ffffff"
  const tooltipBorderColor = isDark ? "#10B981" : "#10B981"
  const tooltipTextColor = isDark ? "#ffffff" : "#000000"
  const legendTextColor = isDark ? "#10B981" : "#047857"

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Tag className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>Event Type Distribution</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBgColor,
                borderColor: tooltipBorderColor,
                color: tooltipTextColor,
              }}
              formatter={(value) => [`${value} events`, ""]}
            />
            <Legend formatter={(value) => <span style={{ color: legendTextColor }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
