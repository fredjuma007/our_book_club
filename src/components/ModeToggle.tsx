"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // After hydration, we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Determine if dark mode is active
  // Only use the theme value after mounting to avoid hydration mismatch
  const isDark = mounted ? theme === "dark" : false

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative h-10 w-20 rounded-md p-1 border-2 border-green-500 dark:border-green-600 
      bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden group"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      whileTap={{ scale: 0.95 }}
    >
      {/* Paper texture */}
      <div className="absolute inset-0 bg-[url('/paper-texture.png')] bg-repeat opacity-10 dark:opacity-5 mix-blend-overlay" />

      {/* Book page lines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_4px,rgba(22,163,74,0.1)_5px)] bg-[size:100%_5px] opacity-20 dark:opacity-10" />

      {/* Track background */}
      <div className="absolute inset-1 rounded-sm bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 transition-colors duration-300" />

      {/* Book bookmark decoration */}
      {mounted && isDark && (
        <div className="absolute -top-1 right-2 w-3 h-5 bg-green-600 rounded-b-sm shadow-sm transform-gpu rotate-3 origin-top z-0">
          <div className="absolute inset-0 bg-[url('/paper-texture.png')] bg-repeat mix-blend-overlay opacity-20" />
        </div>
      )}

      {mounted && !isDark && (
        <div className="absolute -top-1 left-2 w-3 h-5 bg-green-600 rounded-b-sm shadow-sm transform-gpu -rotate-3 origin-top z-0">
          <div className="absolute inset-0 bg-[url('/paper-texture.png')] bg-repeat mix-blend-overlay opacity-20" />
        </div>
      )}

      {/* Slider thumb - only animate after mounting */}
      <motion.div
        className="relative z-10 h-7 w-7 rounded-sm flex items-center justify-center border border-green-200 dark:border-green-800 shadow-md"
        initial={false}
        animate={
          mounted
            ? {
                x: isDark ? 40 : 0,
                backgroundColor: isDark ? "#22c55e" : "#16a34a",
                boxShadow: isDark ? "0 0 10px 2px rgba(34, 197, 94, 0.3)" : "0 0 10px 2px rgba(22, 163, 74, 0.3)",
              }
            : {}
        }
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Book page effect on thumb */}
        <div className="absolute inset-0 bg-[url('/paper-texture.png')] bg-repeat opacity-10 mix-blend-overlay" />

        {/* Only render the correct icon after mounting to prevent hydration mismatch */}
        {mounted && (isDark ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4 text-white" />)}

        {/* Page edge effect */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/20 dark:bg-white/10" />
      </motion.div>

      {/* Light icon - only show after mounting */}
      {mounted && (
        <span
          className={`absolute left-2 top-1/2 -translate-y-1/2 text-green-600 transition-opacity duration-300 ${isDark ? "opacity-30" : "opacity-0"}`}
        >
          <Sun className="h-4 w-4" />
        </span>
      )}

      {/* Dark icon - only show after mounting */}
      {mounted && (
        <span
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-green-400 transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-30"}`}
        >
          <Moon className="h-4 w-4" />
        </span>
      )}
    </motion.button>
  )
}

