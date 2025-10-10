"use client"
import { useState, useRef, useEffect } from "react"
import { StarIcon, BookOpen, Trash2, PenTool, ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { deleteReviewAction, updateReviewAction } from "@/app/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Define proper types for the review and book props
interface Review {
  _id: string
  name?: string
  rating?: number
  review?: string
  bookId?: string
  _owner?: string
}

interface Book {
  _id?: string
  title?: string
  author?: string
  image?: any
}

interface ReviewCardProps {
  review: Review
  book?: Book
}

export function ReviewCard({ review, book }: ReviewCardProps) {
  return (
    <div className="group h-full">
      <div className="p-6 rounded-xl bg-[#fffaf0] dark:bg-gray-800 border border-green-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
        {/* Card Header with Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 font-serif line-clamp-2 flex-grow">
            {book?.title || "Untitled Book"}
          </h3>
          <div className="flex gap-1 flex-shrink-0 ml-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(review?.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : i < (review?.rating || 0)
                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                      : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Book Author */}
        {book?.author && (
          <p className="text-sm text-gray-600 dark:text-gray-400 font-serif mb-1 italic">by {book.author}</p>
        )}

        {/* Review Owner/Name */}
        {review?.name && (
          <p className="text-sm text-gray-500 dark:text-gray-500 font-serif mb-3 font-medium">Review: {review.name}</p>
        )}

        {/* Main Content */}
        <div className="flex gap-4 flex-grow min-w-0">
          {/* Book Image */}
          <div className="flex-shrink-0">
            <Link
              href={book?._id ? `/books/${book._id}` : "#"}
              className={`block relative group/image ${!book?._id ? "pointer-events-none" : ""}`}
            >
              {book?.image ? (
                <Image
                  width={100}
                  height={150}
                  src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                  alt={book?.title || "Book cover"}
                  className="rounded-lg object-cover shadow-md border border-green-700 transition-all duration-300 group-hover/image:scale-105"
                />
              ) : (
                <div className="w-[100px] h-[150px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-green-700">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
              )}
              {book?._id && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <p className="text-white text-xs font-serif px-2 text-center transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
                    View Book
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Review Content */}
          <ReviewContent review={review} book={book} />
        </div>
      </div>
    </div>
  )
}

function ReviewContent({ review, book }: { review: Review; book?: Book }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPendingDelete, setIsPendingDelete] = useState(false)
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const toastIdRef = useRef<string | number | null>(null)

  const [editedReview, setEditedReview] = useState({
    rating: review?.rating || 3,
    review: review?.review || "",
    name: review?.name || "",
    bookId: review?.bookId,
    _owner: review?._owner,
  })

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (!review._id) {
        throw new Error("Review ID is missing")
      }

      await updateReviewAction(review._id, {
        rating: editedReview.rating,
        review: editedReview.review,
        name: editedReview.name,
      })

      setIsEditing(false)
      toast.success("Review updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Failed to update review:", error)
      toast.error("Failed to update review")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!review._id) {
      toast.error("Review ID is missing")
      return
    }

    setIsPendingDelete(true)

    const UNDO_DURATION = 5000 // 5 seconds
    let progress = 100

    const toastId = toast.error(
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between">
          <span className="font-serif">Review will be deleted</span>
          <span className="text-xs opacity-70">{UNDO_DURATION / 1000}s</span>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
            id={`progress-${review._id}`}
          />
        </div>
      </div>,
      {
        duration: UNDO_DURATION,
        action: {
          label: "Undo",
          onClick: () => handleUndo(),
        },
      },
    )

    toastIdRef.current = toastId

    const progressInterval = setInterval(() => {
      progress -= 2
      const progressBar = document.getElementById(`progress-${review._id}`)
      if (progressBar) {
        progressBar.style.width = `${Math.max(0, progress)}%`
      }
      if (progress <= 0) {
        clearInterval(progressInterval)
      }
    }, 100)

    deleteTimeoutRef.current = setTimeout(async () => {
      try {
        await deleteReviewAction(review._id!)
        toast.success("Review deleted successfully")
        router.refresh()
      } catch (error) {
        console.error("Failed to delete review:", error)
        toast.error("Failed to delete review")
        setIsPendingDelete(false)
      } finally {
        clearInterval(progressInterval)
      }
    }, UNDO_DURATION)
  }

  const handleUndo = () => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current)
      deleteTimeoutRef.current = null
    }
    setIsPendingDelete(false)
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current)
    }
    toast.success("Deletion cancelled")
  }

  return (
    <div
      className={`flex-1 flex flex-col min-w-0 transition-opacity duration-300 ${isPendingDelete ? "opacity-50" : "opacity-100"}`}
    >
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-4">
          {/* Edit Name */}
          <div>
            <label className="text-sm font-serif text-gray-600 dark:text-gray-400 mb-1 block">Name</label>
            <Input
              value={editedReview.name}
              onChange={(e) => setEditedReview({ ...editedReview, name: e.target.value })}
              placeholder="Your name"
              className="font-serif"
            />
          </div>

          {/* Edit Rating */}
          <div>
            <label className="text-sm font-serif text-gray-600 dark:text-gray-400 mb-1 block">Rating</label>
            <div className="flex gap-2 items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditedReview({ ...editedReview, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <StarIcon
                    className={`w-6 h-6 ${
                      star <= editedReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={editedReview.rating}
              onChange={(e) => {
                const value = Number.parseFloat(e.target.value)
                if (!isNaN(value) && value >= 0 && value <= 5) {
                  setEditedReview({ ...editedReview, rating: value })
                }
              }}
              placeholder="Enter rating (0-5)"
              className="font-serif w-32"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-serif">
              Click stars for whole numbers or type for decimals (e.g., 4.5)
            </p>
          </div>

          {/* Edit Review Text */}
          <div className="flex-grow">
            <label className="text-sm font-serif text-gray-600 dark:text-gray-400 mb-1 block">Review</label>
            <Textarea
              value={editedReview.review}
              onChange={(e) => setEditedReview({ ...editedReview, review: e.target.value })}
              placeholder="Write your review..."
              className="font-serif w-full min-h-[120px] resize-none"
            />
          </div>

          {/* Edit Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false)
                setEditedReview({
                  rating: review?.rating || 3,
                  review: review?.review || "",
                  name: review?.name || "",
                  bookId: review?.bookId,
                  _owner: review?._owner,
                })
              }}
              disabled={isSaving}
              className="font-serif"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-700 hover:bg-green-800 text-white font-serif"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Review Text */}
          <div className="text-gray-700 dark:text-gray-300 font-serif leading-relaxed text-sm flex-grow break-words">
            {review?.review && review.review.length > 120 && !isExpanded ? (
              <>
                {review.review.substring(0, 120)}...
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="p-0 h-auto text-green-600 hover:text-green-700 font-serif inline-flex items-center"
                >
                  Read More <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </>
            ) : (
              <>
                {review?.review}
                {review?.review && review.review.length > 120 && isExpanded && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="p-0 h-auto text-green-600 hover:text-green-700 font-serif inline-flex items-center"
                  >
                    Read Less <ChevronUp className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isPendingDelete}
              className="text-green-700 border-green-700 hover:bg-green-200 font-serif group disabled:opacity-50 disabled:cursor-not-allowed md:px-4 px-2"
            >
              <PenTool className="w-4 h-4 md:mr-2 transition-transform group-hover:scale-110" />
              <span className="hidden md:inline">Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPendingDelete}
              className="transition-all duration-300 hover:scale-105 group/delete disabled:opacity-50 disabled:cursor-not-allowed md:px-4 px-2"
            >
              <Trash2 className="w-4 h-4 md:mr-2 transition-transform duration-200 group-hover/delete:rotate-12" />
              <span className="hidden md:inline">{isPendingDelete ? "Deleting..." : "Delete"}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
