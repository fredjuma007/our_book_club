"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle, Trash2 } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchReplies = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getRepliesAction(reviewId)
      if (result.success) {
        setReplies(result.replies)
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
  }, [reviewId, toast])

  useEffect(() => {
    fetchReplies()
  }, [fetchReplies])

  const handleSubmitReply = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!replyContent.trim()) {
        toast({
          title: "Error",
          description: "Reply cannot be empty",
          variant: "destructive",
        })
        return
      }

      try {
        const result = await addReplyAction([reviewId], bookId, replyContent)

        if (result.success) {
          setReplyContent("")
          setIsReplying(false)
          await fetchReplies()

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
      }
    },
    [replyContent, reviewId, bookId, toast, fetchReplies],
  )

  const handleDeleteReply = useCallback(
    async (replyId: string) => {
      try {
        await deleteReplyAction(replyId, bookId)
        await fetchReplies()
        toast({
          title: "Deleted",
          description: "Reply deleted successfully",
          className: "bg-green-700 text-white",
        })
      } catch (error) {
        console.error("Error deleting reply:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete reply",
          variant: "destructive",
        })
      }
    },
    [bookId, fetchReplies, toast],
  )

  return (
    <div className="mt-3 space-y-3">
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
        Comment on this review
      </Button>

      {isReplying && (
        <form onSubmit={handleSubmitReply} className="space-y-2">
          <Textarea
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px] border-green-200 focus:border-green-500 dark:border-gray-700 dark:focus:border-green-500"
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
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" className="bg-green-700 hover:bg-green-800 text-white">
              Post Comment
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">Loading comments...</p>
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
                  <span className="sr-only">Delete Comment</span>
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line">{reply.content}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
}