"use client"
import { useState } from "react"
import { StarIcon, BookOpen, Trash2, PenTool, X, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { deleteReviewAction, updateReviewAction } from "@/app/actions"

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
        <div className="flex gap-4 flex-grow">
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
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editedReview, setEditedReview] = useState({
    rating: review?.rating || 3,
    review: review?.review || "",
    name: review?.name || "",
    bookId: review?.bookId,
    _owner: review?._owner,
  })

  const handleSave = async () => {
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
    } catch (error) {
      console.error("Failed to update review:", error)
      alert("Failed to update review. Please try again.")
    }
  }

  if (isEditing) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Input
              value={editedReview.name}
              onChange={(e) => setEditedReview({ ...editedReview, name: e.target.value })}
              className="font-serif"
              placeholder="Review Title"
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="5"
              step="0.5"
              value={editedReview.rating}
              onChange={(e) => setEditedReview({ ...editedReview, rating: Number.parseFloat(e.target.value) })}
              className="w-20 font-serif"
            />
            <StarIcon className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        <Textarea
          value={editedReview.review}
          onChange={(e) => setEditedReview({ ...editedReview, review: e.target.value })}
          className="min-h-[100px] font-serif"
          placeholder="Write your review..."
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="font-serif group">
            <X className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="bg-green-700 hover:bg-green-800 font-serif group"
          >
            <Check className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Review Text */}
      <div className="text-gray-700 dark:text-gray-300 font-serif leading-relaxed text-sm flex-grow">
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
          className="text-green-700 border-green-700 hover:bg-green-200 font-serif group"
        >
          <PenTool className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
          Edit
        </Button>
        <form
          action={async () => {
            if (review?._id) {
              await deleteReviewAction(review._id)
            }
          }}
        >
          <Button
            variant="destructive"
            size="sm"
            type="submit"
            className="transition-all duration-300 hover:scale-105 group/delete"
          >
            <Trash2 className="w-4 h-4 mr-2 transition-transform duration-200 group-hover/delete:rotate-12" />
            Delete
          </Button>
        </form>
      </div>
    </div>
  )
}
