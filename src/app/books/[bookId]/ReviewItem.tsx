"use client"

import { useState } from "react"
import { StarIcon, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { likeReviewAction, unlikeReviewAction } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { ReplySection } from "./reply-section"

interface ReviewItemProps {
  id: string
  name: string
  rating: number
  review: string
  likes?: number
  isLoggedIn: boolean
  bookId: string
  currentUserId?: string
}

export function ReviewItem({
  id,
  name,
  rating,
  review,
  likes = 0,
  isLoggedIn,
  bookId,
  currentUserId,
}: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)
  const [isLiking, setIsLiking] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const { toast } = useToast()

  // Super simple like toggle function
  const handleLikeToggle = async () => {
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
        // Try to unlike
        try {
          const result = await unlikeReviewAction(id, bookId)
          setLikesCount(result.likes)
          setHasLiked(false)
        } catch (error) {
          console.error("Error unliking:", error)
        }
      } else {
        // Try to like
        try {
          const result = await likeReviewAction(id, bookId)
          setLikesCount(result.likes)
          setHasLiked(true)
        } catch (error) {
          // If we get "already liked" error, just set hasLiked to true
          if (error instanceof Error && error.message.includes("already liked")) {
            setHasLiked(true)
          } else {
            throw error
          }
        }
      }
    } catch (error) {
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

  const paragraphs = review.split("\n")
  const isLongReview = paragraphs.length > 3 || review.length > 300
  const displayParagraphs = isExpanded ? paragraphs : paragraphs.length > 1 ? paragraphs.slice(0, 1) : paragraphs

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
          <>
            {displayParagraphs.map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
            {!isExpanded && paragraphs.length > 3 && <p className="text-gray-500">...</p>}
          </>
        ) : (
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

      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`p-1 rounded-full flex items-center justify-center ${hasLiked ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
            onClick={handleLikeToggle}
            disabled={isLiking}
            title={hasLiked ? "Unlike this review" : "Like this review"}
          >
            <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-green-600 dark:fill-green-400" : ""}`} />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {likesCount > 0 ? `${likesCount} ${likesCount === 1 ? "like" : "likes"}` : ""}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplies(!showReplies)}
          className="text-gray-600 dark:text-gray-400 hover:text-green-700 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-gray-700"
        >
          {showReplies ? "Hide Replies" : "Show Replies"}
        </Button>
      </div>

      {showReplies && (
        <ReplySection reviewId={id} bookId={bookId} isLoggedIn={isLoggedIn} currentUserId={currentUserId} />
      )}
    </div>
  )
}
