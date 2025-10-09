"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { MapPin } from "lucide-react"
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

interface LocationTypeDistributionProps {
  events: IEvent[]
}

export function LocationTypeDistribution({ events }: LocationTypeDistributionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Count online vs physical events
  const onlineEvents = events.filter((event) => event.isOnline).length
  const physicalEvents = events.filter((event) => !event.isOnline).length

  // Data for the chart
  const locationData = [
    { name: "Online", value: onlineEvents },
    { name: "In-Person", value: physicalEvents },
  ]

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Colors for the pie chart
  const COLORS = ["#3B82F6", "#10B981"] // blue for online, green for physical

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-blue-900/40" : "from-green-100 to-blue-100"
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
          <MapPin className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>Online vs. In-Person Events</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={locationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {locationData.map((entry, index) => (
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
