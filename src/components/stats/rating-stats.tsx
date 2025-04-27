"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useTheme } from "next-themes"

interface Book {
  _id?: string
  title?: string
  [key: string]: any
}

interface Review {
  _id?: string
  bookId?: string
  rating?: number
  [key: string]: any
}

interface RatingStatsProps {
  reviews: Review[]
  books: Book[]
}

export function RatingStats({ reviews, books }: RatingStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    setMounted(true)
  }, [])

  // Process rating data - only count valid integer ratings
  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  }

  // Count ratings - ensure we only count valid integer ratings
  reviews.forEach((review) => {
    const rating = review.rating
    if (rating && Number.isInteger(rating) && rating >= 1 && rating <= 5) {
      ratingCounts[rating as keyof typeof ratingCounts]++
    }
  })

  // Calculate average rating from valid ratings only
  const validReviews = reviews.filter((review) => {
    const rating = review.rating
    return rating && Number.isInteger(rating) && rating >= 1 && rating <= 5
  })

  const totalRatings = validReviews.length
  const sumRatings = validReviews.reduce((sum, review) => sum + (review.rating || 0), 0)
  const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : "0.0"

  // Prepare data for pie chart
  const ratingData = Object.entries(ratingCounts)
    .map(([rating, count]) => ({
      name: `${rating} Star${Number(rating) !== 1 ? "s" : ""}`,
      value: count,
    }))
    .filter((item) => item.value > 0)

  // Colors for the pie chart - more distinct colors
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"]

  // Determine if we're in light or dark mode
  const isDark =
    mounted &&
    (theme === "dark" ||
      (!theme && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  // Adjust colors based on theme
  const bgGradient = isDark ? "from-green-900/40 to-green-800/20" : "from-green-100 to-green-50"

  const borderColor = isDark ? "border-green-700/30" : "border-green-300"
  const textColor = isDark ? "text-green-400" : "text-green-700"
  const textColorSecondary = isDark ? "text-green-400/70" : "text-green-600/80"
  const iconBgColor = isDark ? "bg-green-700/30" : "bg-green-100"
  const barBgColor = isDark ? "bg-green-900/30" : "bg-green-200/50"
  const barFillColor = isDark ? "bg-green-500" : "bg-green-600"
  const tooltipBgColor = isDark ? "#0f172a" : "#ffffff"
  const tooltipBorderColor = isDark ? "#10B981" : "#10B981"
  const tooltipTextColor = isDark ? "#ffffff" : "#000000"
  const legendTextColor = isDark ? "#10B981" : "#047857"
  const emptyStarColor = isDark ? "text-gray-600" : "text-gray-300"

  return (
    <motion.div
      className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 border ${borderColor} shadow-lg backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Star className="w-5 h-5 text-green-600" />
        </div>
        <h3 className={`text-xl font-serif font-bold ${textColor}`}>Rating Distribution</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col justify-center">
          <div className="text-center">
            <div className={`text-5xl font-bold ${textColor} mb-2`}>{averageRating}</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    Number(averageRating) >= star ? "text-yellow-500 fill-yellow-500" : emptyStarColor
                  }`}
                />
              ))}
            </div>
            <p className={textColorSecondary}>
              from {totalRatings} {totalRatings === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="mt-6 space-y-2">
            {Object.entries(ratingCounts)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className={`w-12 text-right ${textColor}`}>
                    {rating} <Star className="w-3 h-3 inline fill-yellow-500 text-yellow-500" />
                  </div>
                  <div className={`flex-1 h-2 ${barBgColor} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${barFillColor}`}
                      style={{
                        width: `${totalRatings > 0 ? (count / totalRatings) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className={`w-8 ${textColorSecondary} text-sm`}>{count}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="md:col-span-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ratingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBgColor,
                  borderColor: tooltipBorderColor,
                  color: tooltipTextColor,
                }}
                formatter={(value) => [`${value} reviews`, ""]}
              />
              <Legend formatter={(value) => <span style={{ color: legendTextColor }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
