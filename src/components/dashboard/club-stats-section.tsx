"use client"

import { motion } from "framer-motion"
import { BookOpen, TrendingUp, Users, ChevronDown, ChevronUp, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ClubStatsSectionProps {
  totalBooks: number
  totalReviews: number
  topRatedBook?: {
    _id?: string
    title?: string
    avgRating: number
    reviewCount: number
  }
  mostActiveMembers: Array<{
    name: string
    reviewCount: number
  }>
}

export function ClubStatsSection({
  totalBooks,
  totalReviews,
  topRatedBook,
  mostActiveMembers = [],
}: ClubStatsSectionProps) {
  const [leaderboardCount, setLeaderboardCount] = useState(3)

  const displayedMembers = mostActiveMembers.slice(0, leaderboardCount)
  const hasMoreMembers = leaderboardCount < mostActiveMembers.length && mostActiveMembers.length > 3
  const canCollapseMembers = leaderboardCount > 3

  const handleExpandLeaderboard = () => {
    if (leaderboardCount === 3) {
      setLeaderboardCount(5)
    } else if (leaderboardCount === 5) {
      setLeaderboardCount(10)
    }
  }

  const handleCollapseLeaderboard = () => {
    setLeaderboardCount(3)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-700/30 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center gap-2">
        <Users className="w-6 h-6" />
        Club Stats
      </h2>

      <div className="space-y-4">
        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 font-serif flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Total Books
            </span>
            <span className="text-xl font-bold text-green-700 dark:text-green-400 font-serif">{totalBooks}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 font-serif flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Reviews
            </span>
            <span className="text-xl font-bold text-green-700 dark:text-green-400 font-serif">{totalReviews}</span>
          </div>
        </div>

        {/* Top Rated Book */}
        {topRatedBook && (
          <div className="pt-4 border-t border-green-700/30">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-serif mb-2">Top Rated Book</p>
            <Link href={`/books/${topRatedBook._id}`}>
              <p className="font-semibold text-green-700 dark:text-green-400 hover:underline font-serif">
                {topRatedBook.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">⭐ {topRatedBook.avgRating.toFixed(1)}</p>
            </Link>
          </div>
        )}

        {mostActiveMembers.length > 0 && (
          <div className="pt-4 border-t border-green-700/30">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-serif mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Most Active Members
            </p>
            <div
              className={`space-y-2 ${
                leaderboardCount > 5
                  ? "max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-100 dark:scrollbar-track-green-900/20"
                  : ""
              }`}
            >
              {displayedMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-700/20 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 dark:text-green-400 w-6 text-center">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-serif text-gray-700 dark:text-gray-300">{member.name}</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-serif">
                    {member.reviewCount} {member.reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Leaderboard expand/collapse buttons */}
            <div className="mt-3 flex gap-2">
              {hasMoreMembers && (
                <Button
                  onClick={handleExpandLeaderboard}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-700/30 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 font-serif bg-transparent text-xs"
                >
                  <ChevronDown className="w-3 h-3 mr-1" />
                  Show {leaderboardCount === 3 ? "5" : "10"}
                </Button>
              )}
              {canCollapseMembers && (
                <Button
                  onClick={handleCollapseLeaderboard}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-700/30 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 font-serif bg-transparent text-xs"
                >
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Less
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {/*<div className="pt-4 space-y-2">
          <Link href="/stats" className="block">
            <Button
              variant="outline"
              className="w-full text-green-700 border-green-700 hover:bg-green-700 hover:text-white font-serif bg-transparent"
            >
              View Full Stats
            </Button>
          </Link>
        </div>*/}
      </div>
    </motion.div>
  )
}
