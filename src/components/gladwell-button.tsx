"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain } from "lucide-react"
import GladwellAIWidget from "./gladwell-ai-widget"

interface GladwellButtonProps {
  size?: "small" | "large"
  onClick?: () => void
}

export default function GladwellButton({ size = "small", onClick }: GladwellButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      setIsOpen(true)
    }
  }

  // Adjust sizes based on the size prop
  const buttonClasses = size === "large" ? "px-3 py-1 rounded-full" : "px-2 py-0.5 rounded-full"

  const iconSize = size === "large" ? "w-4 h-4" : "w-3 h-3"
  const textSize = size === "large" ? "text-sm" : "text-xs"

  return (
    <>
      <motion.button
        onClick={handleClick}
        className={`bg-gradient-to-r from-purple-600 to-blue-500 ${buttonClasses} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 rgba(139, 92, 246, 0.4)",
            "0 0 20px rgba(139, 92, 246, 0.6)",
            "0 0 0 rgba(139, 92, 246, 0.4)",
          ],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 2,
          duration: 1.5,
        }}
      >
        <Brain className={`${iconSize} text-white mr-1`} />
        <span className={`text-white ${textSize} font-bold tracking-wider`}>Gladwell</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && <GladwellAIWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
