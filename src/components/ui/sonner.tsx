"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-left"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-serif bg-white dark:bg-neutral-900 text-foreground border-2 border-green-700/20 dark:border-green-600/30 shadow-xl rounded-xl p-4",
          description: "font-serif text-muted-foreground",
          actionButton:
            "font-serif bg-green-700 text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg px-4 py-2 transition-colors",
          cancelButton:
            "font-serif bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 rounded-lg px-4 py-2 transition-colors",
          success: "border-green-700/30 dark:border-green-600/40",
          error: "border-red-700/30 dark:border-red-600/40",
          title: "font-serif font-semibold text-foreground",
          icon: "text-green-700 dark:text-green-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
