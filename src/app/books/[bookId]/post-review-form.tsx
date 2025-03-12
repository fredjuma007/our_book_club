"use client"

import type React from "react"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createReviewAction } from "@/app/actions"

const initialReview = {
  name: "",
  rating: 3.5,
  review: "",
}

export function PostReviewForm({ bookId, userName }: { bookId: string; userName: string }) {
  const [newReview, setNewReview] = useState({ ...initialReview, name: userName })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Use FormData with the server action
      const formData = new FormData()
      formData.append("bookId", bookId)
      formData.append("name", newReview.name)
      formData.append("rating", newReview.rating.toString())
      formData.append("review", newReview.review)

      // Use the server action instead of client-side API call
      const result = await createReviewAction(formData)

      if (result.success) {
        setNewReview({ ...initialReview, name: userName })
        toast({
          title: "Your review has been posted",
          description: "Thank you for your feedback!",
        })

        // Force a refresh of all routes that display reviews
        router.refresh()

        // Revalidate the reviews page
        /*try {
          await fetch("/api/revalidate-reviews", { method: "POST" })
        } catch (error) {
          console.error("Error revalidating reviews:", error)
        }*/

        // Add a small delay and then force a hard refresh if needed
        setTimeout(() => {
          window.location.href = window.location.href
        }, 1000)
      } else {
        throw new Error(result.error || "Failed to post review")
      }
    } catch (error) {
      console.error("Error posting review:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Input
        placeholder="Your name"
        value={newReview.name}
        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
        required
      />
      <div className="flex items-center space-x-2">
        <label htmlFor="rating" className="text-sm font-medium text-green-600 dark:text-green-500">
          Rating:
        </label>
        <Input
          id="rating"
          type="number"
          step="0.1" // Allow decimals
          min="1"
          max="5"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({
              ...newReview,
              rating: e.target.value === "" ? 0 : Number.parseFloat(e.target.value), // Ensure decimal support
            })
          }
          className="w-20"
          required
        />
      </div>
      <Textarea
        placeholder="Write your review here..."
        value={newReview.review}
        onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
      />
      <Button
        disabled={isLoading}
        type="submit"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Post Review
      </Button>
    </form>
  )
}
