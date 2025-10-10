"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

interface WelcomeSectionProps {
  memberName: string
}

const quotes = [
  "A reader lives a thousand lives before he dies.",
  "Books are a uniquely portable magic.",
  "Reading is dreaming with open eyes.",
  "The more that you read, the more things you will know.",
  "A book is a dream that you hold in your hand.",
]

export function WelcomeSection({ memberName }: WelcomeSectionProps) {
  const [randomQuote, setRandomQuote] = useState(quotes[0])

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-100/80 to-blue-100/80 dark:from-green-900/30 dark:to-blue-900/30 p-8 border border-green-700/30 shadow-lg"
    >
      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-green-700 dark:text-green-400" />
          <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 font-serif">
            Welcome back, {memberName}!
          </h1>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 font-serif italic mt-4">"{randomQuote}"</p>
      </div>
    </motion.div>
  )
}
