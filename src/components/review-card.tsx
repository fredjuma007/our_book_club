"use client"

import { useState } from "react"
import { StarIcon, BookOpen, Trash2, PenTool, X, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { deleteReviewAction, updateReviewAction } from "@/app/actions"

// ... other imports remain the same ...

export function ReviewCard({ review, book }: any) {
  return (
    <div className="group">
      <div className="p-6 rounded-xl bg-[#fffaf0] dark:bg-gray-800 border border-green-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Book Image Section */}
          <div className="relative">
            <Link 
              href={book?._id ? `/books/${book._id}` : "#"} 
              className={`block relative group/image ${!book?._id ? 'pointer-events-none' : ''}`}
            >
              {book?.image ? (
                <Image
                  width={150}
                  height={200}
                  src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                  alt={book?.title || "Book cover"}
                  className="rounded-lg object-cover shadow-md border border-green-700 transition-all duration-300 group-hover/image:scale-105"
                />
              ) : (
                <div className="w-[150px] h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-green-700">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
              )}
              {book?._id && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <p className="text-white text-sm font-serif px-4 text-center transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
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

function ReviewContent({ review, book }: any) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedReview, setEditedReview] = useState({
      rating: review?.rating,
      review: review?.review,
      name: review?.name,
      // Ensure we keep any other required fields
      bookId: review?.bookId, // Important: Keep the book reference
      _owner: review?._owner, // Keep the owner reference if needed
    })
  
    const handleSave = async () => {
      try {
        await updateReviewAction(review?._id, {
          rating: editedReview.rating,
          review: editedReview.review,
          name: editedReview.name,
        })
        setIsEditing(false)
      } catch (error) {
        console.error("Failed to update review:", error)
        // Optionally add user feedback here
        alert("Failed to update review. Please try again.")
      }
    }

  if (isEditing) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-500 font-serif mb-1">{book?.title}</h3>
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
              onChange={(e) => setEditedReview({ ...editedReview, rating: parseFloat(e.target.value) })}
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="font-serif group"
          >
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
    <div className="flex-1 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-500 font-serif mb-1">{book?.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 font-serif">{review?.name}</p>
        </div>
        <div className="flex gap-1">
          {[...Array(Math.floor(review?.rating))].map((_, i) => (
            <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ))}
          {review?.rating % 1 !== 0 && (
            <StarIcon key="half" className="w-5 h-5 text-yellow-400 fill-yellow-400 opacity-50" />
          )}
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 font-serif leading-relaxed">{review?.review}</p>

      <div className="flex justify-end gap-2">
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
            await deleteReviewAction(review?._id);
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