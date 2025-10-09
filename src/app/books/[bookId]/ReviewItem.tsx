"use client"

import { useState } from "react"
import { StarIcon, Edit2, Trash2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReplySection } from "./reply-section"
import { updateReviewAction, deleteReviewAction } from "@/app/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface ReviewItemProps {
  id: string
  name: string
  rating: number
  review: string
  likes?: number
  isLoggedIn: boolean
  bookId: string
  currentUserId?: string
  isOwnReview?: boolean
}

export function ReviewItem({
  id,
  name,
  rating,
  review,
  isLoggedIn,
  bookId,
  currentUserId,
  isOwnReview = false,
}: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editRating, setEditRating] = useState(rating)
  const [editReview, setEditReview] = useState(review)
  const [isSaving, setIsSaving] = useState(false)
  const [isPendingDelete, setIsPendingDelete] = useState(false)
  const router = useRouter()

  const paragraphs = review.split("\n")
  const isLongReview = paragraphs.length > 3 || review.length > 300
  const displayParagraphs = isExpanded ? paragraphs : paragraphs.length > 1 ? paragraphs.slice(0, 1) : paragraphs

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateReviewAction(id, {
        name: editName,
        rating: editRating,
        review: editReview,
      })

      if (result.success) {
        toast.success("Review updated successfully")
        setIsEditing(false)
        router.refresh()
      } else {
        toast.error("Failed to update review")
      }
    } catch (error) {
      toast.error("Failed to update review")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditName(name)
    setEditRating(rating)
    setEditReview(review)
    setIsEditing(false)
  }

  const handleDelete = () => {
    setIsPendingDelete(true)

    const timeoutId = setTimeout(async () => {
      try {
        const result = await deleteReviewAction(id)

        if (result.success) {
          toast.success("Review deleted successfully")
          router.refresh()
        } else {
          toast.error("Failed to delete review")
          setIsPendingDelete(false)
        }
      } catch (error) {
        toast.error("Failed to delete review")
        setIsPendingDelete(false)
      }
    }, 5000)

    toast.error("Review will be deleted in 5 seconds", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(timeoutId)
          setIsPendingDelete(false)
          toast.success("Deletion cancelled")
        },
      },
    })
  }

  return (
    <div
      className={`border-b pb-4 last:border-none transition-all hover:bg-green-50 dark:hover:bg-gray-700 p-4 rounded-lg ${
        isPendingDelete ? "opacity-50" : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-serif">Name</label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mt-1 font-serif"
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-serif">Rating</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    disabled={isSaving}
                    className="transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    <StarIcon
                      className={`w-6 h-6 ${star <= editRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editRating}
                onChange={(e) => {
                  const val = Number.parseFloat(e.target.value)
                  if (val >= 0 && val <= 5) {
                    setEditRating(val)
                  }
                }}
                className="w-20 font-serif"
                disabled={isSaving}
              />
              <span className="text-sm text-gray-500 font-serif">Click stars or type decimal (0-5)</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-serif">Review</label>
            <Textarea
              value={editReview}
              onChange={(e) => setEditReview(e.target.value)}
              className="mt-1 min-h-[100px] font-serif"
              disabled={isSaving}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-700 hover:bg-green-800 text-white font-serif"
            >
              {isSaving ? (
                <>
                  <Check className="w-4 h-4 mr-2 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isSaving}
              variant="outline"
              className="border-gray-300 font-serif bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="font-semibold text-green-700 dark:text-green-400">{name}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: Math.floor(rating) }).map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
                {rating % 1 !== 0 && <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400 opacity-50" />}
              </div>
              {isOwnReview && (
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={isPendingDelete}
                    className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-gray-600"
                  >
                    <Edit2 className="w-4 h-4 text-green-700 dark:text-green-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isPendingDelete}
                    className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-gray-600"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              )}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-600 dark:text-gray-400 hover:text-green-700 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-gray-700"
            >
              {showReplies ? "Hide Comments" : "Show Comments"}
            </Button>
          </div>

          {showReplies && (
            <ReplySection reviewId={id} bookId={bookId} isLoggedIn={isLoggedIn} currentUserId={currentUserId} />
          )}
        </>
      )}
    </div>
  )
}
