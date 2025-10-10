"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  TrendingUp,
  Calendar,
  MessageSquare,
  Star,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Clock,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DailyDigest {
  insights: string[]
  clubActivity: {
    newReviews: number
    activeDiscussions: number
    upcomingEvents: number
  }
  personalStats: {
    readingStreak: number
    booksThisMonth: number
    averageRating: number
  }
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string // Changed from any to string
  href?: string
  priority: "high" | "medium" | "low"
}

interface EnhancedWelcomeSectionProps {
  memberName: string
  dailyDigest: DailyDigest
  quickActions: QuickAction[]
}

const iconMap: Record<string, any> = {
  Calendar,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Users,
}

export function EnhancedWelcomeSection({ memberName, dailyDigest, quickActions }: EnhancedWelcomeSectionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (!mounted) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-blue-500/10 p-8 mb-8">
        <div className="h-48 animate-pulse bg-green-500/5 rounded-2xl" />
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-blue-500/10 p-8 mb-8"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Greeting */}
        <motion.div variants={item} className="mb-6">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Welcome back, {memberName}! 👋</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-500" />
            Here's your personalized reading digest for today
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Digest - Takes 2 columns */}
          <motion.div variants={item} className="lg:col-span-2 space-y-4">
            <div className="bg-[#0f1621]/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold text-green-400">Daily Digest</h2>
              </div>

              {/* AI Insights */}
              <div className="space-y-3 mb-6">
                {dailyDigest.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{insight}</p>
                  </motion.div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-green-500/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold text-green-400">
                      {dailyDigest.personalStats.booksThisMonth}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Books This Month</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-500/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold text-green-400">
                      {dailyDigest.personalStats.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Avg Rating</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-500/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold text-green-400">{dailyDigest.personalStats.readingStreak}</span>
                  </div>
                  <p className="text-xs text-gray-400">Day Streak</p>
                </div>
              </div>

              {/* Club Activity */}
              <div className="mt-4 pt-4 border-t border-green-500/20">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    <span>{dailyDigest.clubActivity.newReviews} new reviews</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>{dailyDigest.clubActivity.activeDiscussions} active discussions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>{dailyDigest.clubActivity.upcomingEvents} upcoming events</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions - Takes 1 column */}
          <motion.div variants={item} className="space-y-4">
            <div className="bg-[#0f1621]/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold text-green-400">Quick Actions</h2>
              </div>

              <div className="space-y-2">
                {quickActions.slice(0, 5).map((action, index) => {
                  const Icon = iconMap[action.icon] || BookOpen
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {action.href ? (
                        <Link href={action.href}>
                          <div
                            className={`group flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                              action.priority === "high"
                                ? "bg-green-500/10 hover:bg-green-500/20 border border-green-500/30"
                                : "bg-green-500/5 hover:bg-green-500/10"
                            }`}
                          >
                            <div
                              className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                action.priority === "high" ? "bg-green-500/20" : "bg-green-500/10"
                              }`}
                            >
                              <Icon className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-200 truncate">{action.title}</p>
                              <p className="text-xs text-gray-400 truncate">{action.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </div>
                        </Link>
                      ) : (
                        <div
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            action.priority === "high" ? "bg-green-500/10 border border-green-500/30" : "bg-green-500/5"
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              action.priority === "high" ? "bg-green-500/20" : "bg-green-500/10"
                            }`}
                          >
                            <Icon className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">{action.title}</p>
                            <p className="text-xs text-gray-400 truncate">{action.description}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {quickActions.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                >
                  View all actions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
