"use client"

import { useState, useEffect } from "react"
import { StarIcon, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { likeReviewAction, unlikeReviewAction, checkUserLikedReviewAction } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"

interface ReviewItemProps {
  id: string
  name: string
  rating: number
  review: string
  likes?: number
  isLoggedIn: boolean
  bookId: string
}

export function ReviewItem({ id, name, rating, review, likes = 0, isLoggedIn, bookId }: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)
  const [isLiking, setIsLiking] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Check if user has already liked this review
  useEffect(() => {
    async function checkUserLiked() {
      if (isLoggedIn) {
        try {
          const result = await checkUserLikedReviewAction(id)
          setHasLiked(result.hasLiked)
        } catch (error) {
          console.error("Error checking if user liked review:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    checkUserLiked()
  }, [id, isLoggedIn])

  const paragraphs = review.split("\n")

  // Show only first 3 paragraphs or first 300 characters, whichever comes first
  const isLongReview = paragraphs.length > 3 || review.length > 300

  const displayParagraphs = isExpanded ? paragraphs : paragraphs.length > 3 ? paragraphs.slice(0, 3) : paragraphs

  async function handleLikeToggle() {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to like reviews",
        variant: "destructive",
      })
      return
    }

    if (isLiking) return

    setIsLiking(true)

    try {
      if (hasLiked) {
        // Unlike the review
        setLikesCount((prev) => Math.max(0, prev - 1))
        setHasLiked(false)
        await unlikeReviewAction(id, bookId)
      } else {
        // Like the review
        setLikesCount((prev) => prev + 1)
        setHasLiked(true)
        await likeReviewAction(id, bookId)
      }
    } catch (error) {
      // Revert optimistic update if failed
      if (hasLiked) {
        setLikesCount((prev) => prev + 1)
        setHasLiked(true)
      } else {
        setLikesCount((prev) => Math.max(0, prev - 1))
        setHasLiked(false)
      }

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update like status",
        variant: "destructive",
      })
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className="border-b pb-4 last:border-none transition-all hover:bg-green-50 dark:hover:bg-gray-700 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-green-700 dark:text-green-400">{name}</p>
        <div className="flex items-center">
          {Array.from({ length: Math.floor(rating) }).map((_, i) => (
            <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ))}
          {rating % 1 !== 0 && <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400 opacity-50" />}
        </div>
      </div>

      <div className="mt-2 text-gray-700 dark:text-gray-300 font-serif">
        {paragraphs.length > 3 ? (
          // Handle multi-paragraph reviews
          <>
            {displayParagraphs.map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
            {!isExpanded && paragraphs.length > 3 && <p className="text-gray-500">...</p>}
          </>
        ) : (
          // Handle single paragraph but long reviews
          <p>{isExpanded ? review : review.length > 300 ? review.substring(0, 300) + "..." : review}</p>
        )}

        {isLongReview && (
          <Button
            variant="link"
            className="p-0 h-auto text-green-700 dark:text-green-400 font-medium mt-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
        )}
      </div>

      {/* Thumbs up section */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          className={`p-1 rounded-full flex items-center justify-center ${hasLiked ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          onClick={handleLikeToggle}
          disabled={isLiking || isLoading}
          title={hasLiked ? "Unlike this review" : "Like this review"}
        >
          <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-green-600 dark:fill-green-400" : ""}`} />
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {likesCount > 0 ? `${likesCount} ${likesCount === 1 ? "like" : "likes"}` : ""}
        </span>
      </div>
    </div>
  )
}
