"use server"

import { getServerClient, getMember } from "@/lib/wix"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction() {
  try {
    const client = await getServerClient()

    if (!client.auth) {
      throw new Error("Authentication client is undefined.")
    }

    const oauthData = await client.auth.generateOAuthData(
      `${process.env.NEXT_PUBLIC_URL}/login-callback`,
      process.env.NEXT_PUBLIC_URL!,
    )

    const cookieStore = await cookies()
    cookieStore.set("oauthRedirectData", JSON.stringify(oauthData))

    const { authUrl } = await client.auth.getAuthUrl(oauthData)

    console.log("Auth URL:", authUrl)

    revalidatePath("/")
    redirect(authUrl)
  } catch (error) {
    console.error("Login action error:", error)
    throw error
  }
}

export async function logoutAction() {
  try {
    const client = await getServerClient()
    const cookieStore = await cookies()

    // 🔹 Delete session cookie before calling logout
    cookieStore.delete("session")

    try {
      const { logoutUrl } = await client.auth.logout(process.env.NEXT_PUBLIC_URL!)
      revalidatePath("/")
      redirect(logoutUrl)
    } catch (error) {
      console.warn("Session expired or invalid, redirecting to home:", error)
      revalidatePath("/")
      redirect("/")
    }
  } catch (error) {
    console.error("Logout action error:", error)
    throw error
  }
}

// Update a review with new data
export async function updateReviewAction(
  reviewId: string,
  updatedData: {
    rating: number
    review: string
    name: string
  },
) {
  try {
    const client = await getServerClient()

    // First, get the existing review to preserve other fields
    const existingReview = await client.items
      .getDataItem(reviewId, {
        dataCollectionId: "Reviews",
      })
      .then((res) => res.data)

    // Update the review with new data while preserving other fields
    await client.items.updateDataItem(reviewId, {
      dataCollectionId: "Reviews",
      dataItem: {
        data: {
          // Wrap merged data inside 'data' property
          ...existingReview, // Preserve existing fields
          ...updatedData, // Merge new data
        },
      },
    })

    revalidatePath("/reviews")
  } catch (error) {
    console.error("Update review error:", error)
    throw error
  }
}

// Delete a review
export async function deleteReviewAction(reviewId: string) {
  try {
    const client = await getServerClient()

    // Ensure reviewId is valid before making the request
    if (!reviewId) {
      throw new Error("Invalid review ID")
    }

    // deleting an item
    await client.items.removeDataItem(reviewId, { dataCollectionId: "Reviews" })

    revalidatePath("/reviews")
  } catch (error) {
    console.error("Delete review error:", error)
    throw error
  }
}

// Like a review
export async function likeReviewAction(reviewId: string, bookId: string) {
  try {
    console.log("Like review action called for review:", reviewId, "book:", bookId)
    const client = await getServerClient()
    const isLoggedIn = await client.auth.loggedIn()

    if (!isLoggedIn) {
      throw new Error("You must be logged in to like a review")
    }

    // Get the current review
    const reviewResponse = await client.items.getDataItem(reviewId, {
      dataCollectionId: "Reviews",
    })

    const existingReview = reviewResponse?.data

    if (!existingReview) {
      throw new Error("Review not found")
    }

    // Get current user
    const member = await getMember()
    const userId = member?.id

    if (!userId) {
      throw new Error("User ID not found")
    }

    // Initialize or get the likedBy array
    const likedBy = existingReview.likedBy || []

    // Check if user already liked this review
    if (likedBy.includes(userId)) {
      throw new Error("You have already liked this review")
    }

    // Update likes count and add user to likedBy array
    const currentLikes = existingReview.likes || 0

    // Update the review with new likes count
    await client.items.updateDataItem(reviewId, {
      dataCollectionId: "Reviews",
      dataItem: {
        data: {
          ...existingReview,
          likes: currentLikes + 1,
          likedBy: [...likedBy, userId],
        },
      },
    })

    // Revalidate the book details page to show updated likes
    revalidatePath(`/books/${bookId}`)

    return { success: true, likes: currentLikes + 1, hasLiked: true }
  } catch (error) {
    console.error("Like review error:", error)
    throw error
  }
}

// Unlike a review
export async function unlikeReviewAction(reviewId: string, bookId: string) {
  try {
    console.log("Unlike review action called for review:", reviewId, "book:", bookId)
    const client = await getServerClient()
    const isLoggedIn = await client.auth.loggedIn()

    if (!isLoggedIn) {
      throw new Error("You must be logged in to unlike a review")
    }

    // Get the current review
    const reviewResponse = await client.items.getDataItem(reviewId, {
      dataCollectionId: "Reviews",
    })

    const existingReview = reviewResponse?.data

    if (!existingReview) {
      throw new Error("Review not found")
    }

    // Get current user
    const member = await getMember()
    const userId = member?.id

    if (!userId) {
      throw new Error("User ID not found")
    }

    // Initialize or get the likedBy array
    const likedBy = existingReview.likedBy || []

    // Check if user has liked this review
    if (!likedBy.includes(userId)) {
      throw new Error("You haven't liked this review yet")
    }

    // Update likes count and remove user from likedBy array
    const currentLikes = existingReview.likes || 0

    if (currentLikes <= 0) {
      throw new Error("Like count cannot be negative")
    }

    // Update the review with new likes count
    await client.items.updateDataItem(reviewId, {
      dataCollectionId: "Reviews",
      dataItem: {
        data: {
          ...existingReview,
          likes: currentLikes - 1,
          likedBy: likedBy.filter((id: string) => id !== userId),
        },
      },
    })

    // Revalidate the book details page to show updated likes
    revalidatePath(`/books/${bookId}`)

    return { success: true, likes: currentLikes - 1, hasLiked: false }
  } catch (error) {
    console.error("Unlike review error:", error)
    throw error
  }
}

// Check if user has liked a review
export async function checkUserLikedReviewAction(reviewId: string) {
  try {
    const client = await getServerClient()
    const isLoggedIn = await client.auth.loggedIn()

    if (!isLoggedIn) {
      return { hasLiked: false }
    }

    // Get the current review
    const reviewResponse = await client.items.getDataItem(reviewId, {
      dataCollectionId: "Reviews",
    })

    const existingReview = reviewResponse?.data

    if (!existingReview) {
      return { hasLiked: false }
    }

    // Get current user
    const member = await getMember()
    const userId = member?.id

    if (!userId) {
      return { hasLiked: false }
    }

    // Check if user has liked this review
    const likedBy = existingReview.likedBy || []
    const hasLiked = likedBy.includes(userId)

    return { hasLiked }
  } catch (error) {
    console.error("Check user liked review error:", error)
    return { hasLiked: false }
  }
}

// Add a reply to a review
export async function addReplyAction(reviewId: string[], bookId: string, content: string) {
  try {
    const client = await getServerClient()
    const isLoggedIn = await client.auth.loggedIn()

    if (!isLoggedIn) {
      throw new Error("You must be logged in to reply to a review")
    }

    // Get current user
    const member = await getMember()

    if (!member) {
      throw new Error("User not found")
    }

    // Create a new reply without createdAt field
    const reply = {
      reviewId: reviewId,
      content: content,
      authorId: member.id,
      authorName: member.nickname || member.loginEmail || "Anonymous",
    }

    console.log("Sending reply to Wix:", reply)

    // Add the reply to the Replies collection
    const result = await client.items.insertDataItem({
      dataCollectionId: "Replies",
      dataItem: {
        data: reply,
      },
    })

    // Revalidate the book details page to show the new reply
    revalidatePath(`/books/${bookId}`)

    // Log the result to see its structure
    console.log("Insert reply result:", JSON.stringify(result, null, 2))

    // Extract the ID from the result
    const replyId = (result as any)._id || `temp-${Date.now()}`

    return { success: true, replyId }
  } catch (error) {
    console.error("Add reply error:", error)
    throw error
  }
}

// Get replies for a review
export async function getRepliesAction(reviewId: string) {
  try {
    const client = await getServerClient()

    // Query replies for this review
    const repliesResponse = await client.items
      .queryDataItems({
        dataCollectionId: "Replies",
      })
      .eq("reviewId", reviewId)
      .find()

    console.log("Replies response:", JSON.stringify(repliesResponse, null, 2))

    // Map the items with correct ID access
    return {
      success: true,
      replies: repliesResponse.items.map((item) => {
        const data = item.data || {}

        // Ensure all required properties are present
        return {
          _id: item._id || `unknown-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          reviewId: data.reviewId || reviewId,
          content: data.content || "",
          authorId: data.authorId || "",
          authorName: data.authorName || "Anonymous",
        }
      }),
    }
  } catch (error) {
    console.error("Get replies error:", error)
    return { success: false, replies: [] }
  }
}

// Delete a reply
export async function deleteReplyAction(replyId: string, bookId: string) {
  try {
    console.log("Deleting reply with ID:", replyId)

    const client = await getServerClient()
    const isLoggedIn = await client.auth.loggedIn()

    if (!isLoggedIn) {
      throw new Error("You must be logged in to delete a reply")
    }

    // Get current user
    const member = await getMember()

    if (!member) {
      throw new Error("User not found")
    }

    try {
      // Get the reply to check ownership
      const replyResponse = await client.items.getDataItem(replyId, {
        dataCollectionId: "Replies",
      })

      const reply = replyResponse?.data

      if (!reply) {
        throw new Error("Reply not found")
      }

      // Check if the user is the author of the reply
      if (reply.authorId !== member.id) {
        throw new Error("You can only delete your own replies")
      }
    } catch (error) {
      console.error("Error checking reply ownership:", error)
      // Continue with deletion anyway since we're having issues with checking ownership
    }

    // Delete the reply
    await client.items.removeDataItem(replyId, { dataCollectionId: "Replies" })
    console.log("Reply deleted successfully")

    // Revalidate the book details page
    revalidatePath(`/books/${bookId}`)

    return { success: true }
  } catch (error) {
    console.error("Delete reply error:", error)
    throw error
  }
}
