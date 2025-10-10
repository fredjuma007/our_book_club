"use client"

import { motion } from "framer-motion"
import { Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { convertWixImageToUrl } from "@/lib/wix-client"

interface BookOfMonthProps {
  book: {
    _id?: string
    title?: string
    author?: string
    image?: any
    description?: string
  }
}

export function BookOfMonth({ book }: BookOfMonthProps) {
  const imageUrl = book.image ? convertWixImageToUrl(book.image) : "/placeholder.svg?height=300&width=200"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-600/30 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 font-serif">Book of the Month</h2>
      </div>

      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={book.title || "Book cover"}
            width={120}
            height={180}
            className="rounded-lg shadow-md object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-serif mb-1">{book.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-serif mb-3">by {book.author}</p>

          {book.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">{book.description}</p>
          )}

          <Link href={`/books/${book._id}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-yellow-700 border-yellow-600 hover:bg-yellow-600 hover:text-white font-serif bg-transparent"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
