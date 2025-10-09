"use client"

import { useState, useEffect } from "react"
import { motion, type Variants } from "framer-motion"
import { Calendar, Users, MapPin } from "lucide-react"
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

interface StatsOverviewProps {
  events: IEvent[]
}

export function StatsOverview({ events }: StatsOverviewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Calculate stats
  const totalEvents = events.length

  // Count unique moderators
  const uniqueModerators = new Set<string>()
  events.forEach((event) => {
    event.moderators.forEach((moderator) => {
      uniqueModerators.add(moderator)
    })
  })
  const totalModerators = uniqueModerators.size

  // Count online vs physical events
  const onlineEvents = events.filter((event) => event.isOnline).length
  const physicalEvents = events.filter((event) => !event.isOnline).length

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-green-800/20" : "from-green-100 to-green-50"

  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-400" : "text-green-700"
  const textColorSecondary = isDark ? "text-green-400/80" : "text-green-600/80"
  const headingColor = isDark ? "text-green-500" : "text-green-700"
  const valueColor = isDark ? "text-white" : "text-green-800"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <motion.div
        className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <Calendar className={`w-6 h-6 ${headingColor}`} />
          </div>
          <h3 className={`text-xl font-serif font-bold ${headingColor}`}>Total Events</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${valueColor}`}>{totalEvents}</span>
          <span className={`${textColorSecondary} mb-1`}>events hosted</span>
        </div>
      </motion.div>

      <motion.div
        className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <MapPin className={`w-6 h-6 ${headingColor}`} />
          </div>
          <h3 className={`text-xl font-serif font-bold ${headingColor}`}>Event Locations</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${valueColor}`}>{onlineEvents}</span>
          <span className={`${textColorSecondary} mb-1`}>online</span>
          <span className={`text-4xl font-bold ${valueColor} ml-4`}>{physicalEvents}</span>
          <span className={`${textColorSecondary} mb-1`}>in-person</span>
        </div>
      </motion.div>

      <motion.div
        className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
        variants={itemVariants}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <Users className={`w-6 h-6 ${headingColor}`} />
          </div>
          <h3 className={`text-xl font-serif font-bold ${headingColor}`}>Total Moderators</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-4xl font-bold ${valueColor}`}>{totalModerators}</span>
          <span className={`${textColorSecondary} mb-1`}>unique moderators</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
