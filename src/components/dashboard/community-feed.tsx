"use client"

import { motion } from "framer-motion"
import { MessageSquare, Star, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CommunityFeedProps {
  recentReviews: Array<{
    review: {
      _id: string
      name?: string
      rating?: number
      review?: string
      bookId?: string
      _createdDate?: string
    }
    book: {
      _id?: string
      title?: string
      author?: string
      image?: any
    }
  }>
}

export function CommunityFeed({ recentReviews }: CommunityFeedProps) {
  const [displayCount, setDisplayCount] = useState(3)

  const limitedReviews = recentReviews.slice(0, 10)
  const displayedReviews = limitedReviews.slice(0, displayCount)
  const hasMore = displayCount < limitedReviews.length
  const canCollapse = displayCount > 3

  const handleExpand = () => {
    if (displayCount === 3) {
      setDisplayCount(5)
    } else if (displayCount === 5) {
      setDisplayCount(10)
    }
  }

  const handleCollapse = () => {
    setDisplayCount(3)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-700/30 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Community Feed
      </h2>

      <div
        className={`space-y-4 ${
          displayCount > 5
            ? "max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-100 dark:scrollbar-track-green-900/20"
            : ""
        }`}
      >
        {recentReviews.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 font-serif py-8">No recent reviews yet</p>
        ) : (
          displayedReviews.map((item, index) => {
            const imageUrl = item.book.image
              ? convertWixImageToUrl(item.book.image)
              : "/placeholder.svg?height=60&width=40"

            return (
              <motion.div
                key={item.review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-700/30 hover:shadow-md transition-shadow"
              >
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={item.book.title || "Book cover"}
                  width={40}
                  height={60}
                  className="rounded object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-green-800 dark:text-green-400 font-serif truncate">
                      {item.review.name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{item.review.rating}</span>
                    </div>
                  </div>

                  <Link href={`/books/${item.book._id}`}>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-serif hover:underline truncate">
                      {item.book.title}
                    </p>
                  </Link>

                  {item.review.review && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{item.review.review}</p>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {item.review._createdDate
                      ? new Date(item.review._createdDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Recently"}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {hasMore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex-1">
            <Button
              onClick={handleExpand}
              variant="outline"
              className="w-full border-green-700/30 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 font-serif bg-transparent"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Show More ({displayCount === 3 ? "5" : "10"} reviews)
            </Button>
          </motion.div>
        )}
        {canCollapse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex-1">
            <Button
              onClick={handleCollapse}
              variant="outline"
              className="w-full border-green-700/30 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 font-serif bg-transparent"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              Show Less
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
