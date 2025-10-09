"use client"

import type React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Star } from "lucide-react"
import { createReviewAction } from "@/app/actions"
import { useRouter } from "next/navigation"

const initialReview = {
  name: "",
  rating: 0.5,
  review: "",
}

export function PostReviewForm({ bookId, userName }: { bookId: string; userName: string }) {
  const [newReview, setNewReview] = useState({ ...initialReview, name: userName })
  const [isLoading, setIsLoading] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("bookId", bookId)
      formData.append("name", newReview.name)
      formData.append("rating", newReview.rating.toString())
      formData.append("review", newReview.review)

      const result = await createReviewAction(formData)

      if (result.success) {
        setNewReview({ ...initialReview, name: userName })
        toast.success("Review Posted!", {
          description: "Your review has been posted successfully.",
        })
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to post review")
      }
    } catch (error) {
      console.error("Error posting review:", error)
      toast.error("Error", {
        description: (error as Error).message || "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg p-6 border border-green-700/30">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1 font-serif"
          >
            Your Name
          </label>
          <Input
            id="name"
            placeholder="Your name"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            required
            className="border-green-700/30 focus:border-green-700 focus:ring-green-700/20 bg-white/80 dark:bg-gray-800/80 font-serif"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1 font-serif">
            Your Rating
          </label>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoverRating || newReview.rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({
                  ...newReview,
                  rating: e.target.value === "" ? 0 : Number.parseFloat(e.target.value),
                })
              }
              className="w-20 border-green-700/30 focus:border-green-700 focus:ring-green-700/20 bg-white/80 dark:bg-gray-800/80 font-serif ml-2"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="review"
            className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1 font-serif"
          >
            Your Review
          </label>
          <Textarea
            id="review"
            placeholder="Write your review here..."
            value={newReview.review}
            onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
            className="min-h-[120px] border-green-700/30 focus:border-green-700 focus:ring-green-700/20 bg-white/80 dark:bg-gray-800/80 font-serif"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          disabled={isLoading}
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
        >
          <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Star className="h-4 w-4 mr-2" />}
          Post Review
        </Button>
      </div>
    </form>
  )
}
