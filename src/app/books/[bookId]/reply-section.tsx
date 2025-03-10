"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { addReplyAction, getRepliesAction, deleteReplyAction } from "@/app/actions"

interface Reply {
  _id: string
  content: string
  authorId: string
  authorName: string
}

interface ReplySectionProps {
  reviewId: string
  bookId: string
  isLoggedIn: boolean
  currentUserId?: string
}

export function ReplySection({ reviewId, bookId, isLoggedIn, currentUserId }: ReplySectionProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [replies, setReplies] = useState<Reply[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [hasReplies, setHasReplies] = useState(false)
  const { toast } = useToast()

  // Always check for replies when component mounts
  useEffect(() => {
    checkForReplies()
  }, [])

  // Fetch replies when showReplies is toggled to true
  useEffect(() => {
    if (showReplies) {
      fetchReplies()
    }
  }, [showReplies])

  // Check if there are any replies without showing them
  async function checkForReplies() {
    try {
      const result = await getRepliesAction(reviewId)
      if (result.success) {
        const hasAnyReplies = result.replies.length > 0
        setHasReplies(hasAnyReplies)
        setReplies(result.replies)
      }
    } catch (error) {
      console.error("Error checking for replies:", error)
    }
  }

  async function fetchReplies() {
    setIsLoading(true)
    try {
      const result = await getRepliesAction(reviewId)
      if (result.success) {
        setReplies(result.replies)
        setHasReplies(result.replies.length > 0)
      }
    } catch (error) {
      console.error("Error fetching replies:", error)
      toast({
        title: "Error",
        description: "Failed to load replies",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault()

    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Reply cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addReplyAction([reviewId], bookId, replyContent)

      if (result.success) {
        // Add the new reply to the list with optimistic update
        const newReply: Reply = {
          _id: result.replyId,
          content: replyContent,
          authorId: currentUserId || "",
          authorName: "You", // Will be replaced when we fetch again
        }

        setReplies((prev) => [...prev, newReply])
        setReplyContent("")
        setIsReplying(false)
        setHasReplies(true)

        // Show replies if they were hidden
        setShowReplies(true)

        // Refresh replies to get the actual data
        fetchReplies()

        toast({
          title: "Success",
          description: "Your reply has been posted",
          className: "bg-green-700 text-white",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post reply",
        variant: "destructive",
        className: "bg-green-700 text-white",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteReply(replyId: string) {
    try {
      console.log("Attempting to delete reply:", replyId)

      // Optimistic update
      setReplies((prev) => prev.filter((reply) => reply._id !== replyId))

      await deleteReplyAction(replyId, bookId)

      toast({
        title: "Deleted",
        description: "Reply deleted successfully",
        className: "bg-green-700 text-white",
      })

      // Check if we still have replies
      if (replies.length <= 1) {
        fetchReplies() // This will update hasReplies state
      }
    } catch (error) {
      console.error("Error deleting reply:", error)

      // Revert optimistic update by fetching again
      fetchReplies()

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete reply",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Reply button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 dark:text-gray-400 hover:text-green-700 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-gray-700 p-1 h-auto"
          onClick={() => {
            if (!isLoggedIn) {
              toast({
                title: "Login Required",
                description: "Please log in to reply to reviews",
                variant: "destructive",
              })
              return
            }
            setIsReplying(!isReplying)
          }}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Reply
        </Button>

        {hasReplies && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-green-700 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-gray-700 p-1 h-auto"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide Replies
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show Replies ({replies.length})
              </>
            )}
          </Button>
        )}
      </div>

      {/* Reply form */}
      {isReplying && (
        <form onSubmit={handleSubmitReply} className="space-y-2">
          <Textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px] border-green-200 focus:border-green-500 dark:border-gray-700 dark:focus:border-green-500"
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsReplying(false)
                setReplyContent("")
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="bg-green-700 hover:bg-green-800 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </form>
      )}

      {/* Replies list */}
      {showReplies && (
        <div className="space-y-3 pl-4 border-l-2 border-green-100 dark:border-gray-700 mt-2">
          {isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Loading replies...</p>
          ) : replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply._id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{reply.authorName}</p>
                  </div>
                  {currentUserId === reply.authorId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-gray-500 hover:text-red-500"
                      onClick={() => handleDeleteReply(reply._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete reply</span>
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">{reply.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No replies yet. Be the first to reply!</p>
          )}
        </div>
      )}
    </div>
  )
}
