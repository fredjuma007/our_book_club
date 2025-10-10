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
  "Books are the mirrors of the soul.",
  "Reading gives us someplace to go when we have to stay where we are.",
  "A room without books is like a body without a soul.",
  "So many books, so little time.",
  "Books are a refuge, a sort of cloistral refuge, from the vulgarities of the actual world.",
  "Sometimes you need fantasy to understand reality.",
  "There is no friend as loyal as a book.",
  "Books wash away from the soul the dust of everyday life.",
]

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return "Good Morning"
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon"
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening"
  } else {
    return "Cozy Night"
  }
}

export function WelcomeSection({ memberName }: WelcomeSectionProps) {
  const [randomQuote, setRandomQuote] = useState(quotes[0])
  const [greeting, setGreeting] = useState("Welcome back")

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)])
    setGreeting(getTimeBasedGreeting())
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-br from-green-100/80 to-blue-100/80 dark:from-green-900/30 dark:to-blue-900/30 p-4 md:p-8 border border-green-700/30 shadow-md md:shadow-lg"
    >
      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-green-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 md:w-64 md:h-64 bg-blue-400/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-green-700 dark:text-green-400" />
          <h1 className="text-2xl md:text-4xl font-bold text-green-800 dark:text-green-400 font-serif">
            {greeting}, {memberName}!
          </h1>
        </div>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-serif italic mt-2 md:mt-4">
          "{randomQuote}"
        </p>
      </div>
    </motion.div>
  )
}
