"use client"

import { useState, useEffect } from "react"
import { motion, type Variants } from "framer-motion"
import { Users, Award } from "lucide-react"
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

interface ModeratorStatsProps {
  events: IEvent[]
}

export function ModeratorStats({ events }: ModeratorStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Process moderator data
  const moderatorCounts: Record<string, number> = {}
  const moderatorEvents: Record<string, string[]> = {}

  events.forEach((event) => {
    event.moderators.forEach((moderator) => {
      moderatorCounts[moderator] = (moderatorCounts[moderator] || 0) + 1

      if (!moderatorEvents[moderator]) {
        moderatorEvents[moderator] = []
      }
      moderatorEvents[moderator].push(event.title)
    })
  })

  // Get top moderators
  const topModerators = Object.entries(moderatorCounts)
    .map(([name, count]) => ({
      name,
      count,
      events: moderatorEvents[name] || [],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-green-800/20" : "from-green-100 to-green-50"

  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-500" : "text-green-700"
  const textColorSecondary = isDark ? "text-green-400/70" : "text-green-600/80"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const itemBgColor = isDark ? "bg-green-900/20" : "bg-white/80"
  const itemBorderColor = isDark ? "border-green-700/20" : "border-green-200"
  const countBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const countTextColor = isDark ? "text-green-300" : "text-green-700"

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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Users className={`w-5 h-5 ${textColor}`} />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>Top Moderators</h3>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {topModerators.map((moderator, index) => (
          <motion.div
            key={moderator.name}
            className={`${itemBgColor} rounded-lg p-4 border ${itemBorderColor}`}
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {index === 0 && (
                  <div className="text-yellow-500">
                    <Award className="w-5 h-5" />
                  </div>
                )}
                <h4 className={`font-serif font-bold ${textColor}`}>{moderator.name}</h4>
              </div>
              <span className={`${countBgColor} px-2 py-1 rounded text-sm ${countTextColor}`}>
                {moderator.count} {moderator.count === 1 ? "event" : "events"}
              </span>
            </div>
            <div className={`mt-2 text-sm ${textColorSecondary}`}>
              <span className="font-medium">Recent events:</span> {moderator.events.slice(0, 3).join(", ")}
              {moderator.events.length > 3 ? "..." : ""}
            </div>
          </motion.div>
        ))}

        {topModerators.length === 0 && (
          <div className="text-center py-8 text-green-400/70">No moderator data available</div>
        )}
      </motion.div>
    </motion.div>
  )
}
