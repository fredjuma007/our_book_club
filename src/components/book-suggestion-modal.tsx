"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BookPlus, Send, CheckCircle, AlertCircle, LogIn } from "lucide-react"
import { getClient } from "@/lib/wix-client"
import { loginAction } from "@/app/actions"

interface BookSuggestionModalProps {
  isLoggedIn: boolean
  userEmail?: string | null
  userName?: string | null
}

export function BookSuggestionModal({ isLoggedIn, userEmail, userName }: BookSuggestionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: userName || "",
    email: userEmail || "",
    bookTitle: "",
    author: "",
    genre: "",
    reason: "",
    membershipStatus: "member", // Default to member since only logged-in users can access
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const client = getClient()

      await client.items.insert("BookSuggestions", {
        name: formData.name,
        email: formData.email,
        bookTitle: formData.bookTitle,
        author: formData.author,
        genre: formData.genre,
        reason: formData.reason,
        membershipStatus: formData.membershipStatus,
        status: "Pending", // Default status for new suggestions
        reviewed: false, // Boolean to track if suggestion has been reviewed
        createdAt: new Date().toISOString(),
      })

      // Reset form and show success message
      setFormData({
        name: userName || "",
        email: userEmail || "",
        bookTitle: "",
        author: "",
        genre: "",
        reason: "",
        membershipStatus: "member",
      })
      setIsSuccess(true)

      // Reset success message and close modal after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setIsOpen(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting book suggestion:", error)
      alert("There was an error submitting your suggestion. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      setIsOpen(open)
      if (!open) {
        setIsSuccess(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-900/20 bg-transparent"
        >
          <BookPlus className="w-4 h-4 mr-1" />
          <span>Suggest Book</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-[#fffaf0] dark:bg-gray-800 border border-green-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif text-center">
            Suggest a Book for Our Club
          </DialogTitle>
        </DialogHeader>

        {!isLoggedIn ? (
          // Login Required UI
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-500 font-serif">Login Required</h3>
              <p className="text-gray-600 dark:text-gray-400 font-serif">
                Please log in to suggest a book for our club. Only registered members can submit book suggestions.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 font-serif">
                    Why do we require login?
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-serif mt-1">
                    This helps us verify suggestions and prioritize recommendations from our club members.
                  </p>
                </div>
              </div>
            </div>
            <form action={loginAction}>
              <Button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white font-serif group relative overflow-hidden w-full"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <LogIn className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                Login to Suggest a Book
              </Button>
            </form>
          </div>
        ) : isSuccess ? (
          // Success Message
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-700 dark:text-green-300 p-6 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-green-700 mx-auto mb-4" />
            <p className="font-serif text-lg font-medium">Thank you for your suggestion!</p>
            <p className="font-serif mt-2">We'll review your book recommendation and get back to you soon.</p>
          </div>
        ) : (
          // Book Suggestion Form
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Important Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 font-serif">
                    Club Members Priority
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-serif mt-1">
                    Book suggestions from verified club members will be given priority during our selection process.
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-600 dark:text-gray-300 font-serif">
                  Your Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border-green-700/30"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-600 dark:text-gray-300 font-serif">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border-green-700/30"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Membership Status */}
            <div className="space-y-3">
              <Label className="text-gray-600 dark:text-gray-300 font-serif">Membership Status</Label>
              <RadioGroup
                value={formData.membershipStatus}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, membershipStatus: value }))}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="member" id="member" />
                  <Label htmlFor="member" className="text-sm font-serif text-gray-700 dark:text-gray-300">
                    I am a verified club member
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-member" id="non-member" />
                  <Label htmlFor="non-member" className="text-sm font-serif text-gray-700 dark:text-gray-300">
                    I am not yet a club member
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Book Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookTitle" className="text-gray-600 dark:text-gray-300 font-serif">
                  Book Title
                </Label>
                <Input
                  id="bookTitle"
                  name="bookTitle"
                  required
                  value={formData.bookTitle}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border-green-700/30"
                  placeholder="Enter the book title"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-gray-600 dark:text-gray-300 font-serif">
                    Author
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-700 border-green-700/30"
                    placeholder="Author's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-gray-600 dark:text-gray-300 font-serif">
                    Genre
                  </Label>
                  <Input
                    id="genre"
                    name="genre"
                    required
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-700 border-green-700/30"
                    placeholder="e.g., Fiction, Mystery, Romance"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-gray-600 dark:text-gray-300 font-serif">
                  Why do you recommend this book? (Optional)
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border-green-700/30 min-h-[80px]"
                  placeholder="Tell us why you think this book would be great for our club..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="font-serif"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-700 hover:bg-green-800 text-white font-serif group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Send className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                {isSubmitting ? "Submitting..." : "Submit Suggestion"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
