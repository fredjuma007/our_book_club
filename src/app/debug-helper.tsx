"use client"

import { useEffect } from "react"
import { getClient } from "@/lib/wix-client"

export function DebugReviews({ bookId }: { bookId: string }) {
  useEffect(() => {
    async function fetchReviews() {
      try {
        const client = getClient()
        const reviewsResponse = await client.items
          .queryDataItems({
            dataCollectionId: "Reviews",
          })
          .eq("bookId", bookId)
          .find()

        console.log("Client-side raw reviews:", JSON.stringify(reviewsResponse, null, 2))
      } catch (error) {
        console.error("Error fetching reviews for debugging:", error)
      }
    }

    fetchReviews()
  }, [bookId])

  return null // This component doesn't render anything
}
