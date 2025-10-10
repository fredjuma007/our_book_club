"use client"

import { motion } from "framer-motion"
import { BookOpen, Heart, Star } from "lucide-react"

interface MyStatsProps {
  totalReviews: number
  avgRating: number
  lovedBooks: number
}

export function MyStats({ totalReviews, avgRating, lovedBooks }: MyStatsProps) {
  const stats = [
    {
      icon: BookOpen,
      label: "Books Rated",
      value: totalReviews,
      color: "text-green-700 dark:text-green-400",
    },
    {
      icon: Heart,
      label: "Favourites",
      value: lovedBooks,
      color: "text-red-600 dark:text-red-400",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: avgRating.toFixed(1),
      color: "text-yellow-600 dark:text-yellow-400",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-700/30 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-green-100 dark:bg-green-900/30 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-800 dark:text-green-400 font-serif">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-serif">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
