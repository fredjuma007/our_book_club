import { Button } from "@/components/ui/button"
import { getMember, getServerClient } from "@/lib/wix"
import { BookOpen, BookMarked, PenTool, Sparkles } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ReviewCard } from "@/components/review-card"

export default async function ReviewsPage() {
  const member = await getMember()

  if (!member) {
    redirect("/")
  }

  const client = await getServerClient()
  const reviews = await client.items
    .queryDataItems({
      dataCollectionId: "Reviews",
    })
    .eq("_owner", member.id)
    .find()
    .then((res) => res.items.map((item) => item.data))

  // Filter out reviews with missing bookIds and fetch book data
  const books = await Promise.all(
    reviews
      .filter(review => review?.bookId) // Only process reviews with valid bookIds
      .map(async (review) => {
        try {
          const book = await client.items
            .getDataItem(review?.bookId ?? "Unknown", { dataCollectionId: "Books" })
            .then((res) => res.data)
          return { review, book }
        } catch (error) {
          console.error(`Failed to fetch book for review ${review?._id}:`, error)
          // Return the review with a placeholder book object
          return {
            review,
            book: {
              _id: review?.bookId ?? "Unknown",
              title: "Book Not Found",
              image: null
            }
          }
        }
      })
  )

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 selection:bg-green-700/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          {/* Floating Elements */}
          <div className="absolute right-10 top-10 hidden lg:block animate-[bounce_6s_ease-in-out_infinite]">
            <BookOpen className="w-16 h-16 text-green-700/30 transform rotate-12" />
          </div>
          <div className="absolute left-20 bottom-10 hidden lg:block animate-[bounce_8s_ease-in-out_infinite]">
            <PenTool className="w-12 h-12 text-green-700/20 transform -rotate-12" />
          </div>

          {/* Header Content */}
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 relative inline-block group">
              <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              Your Reviews ⭐
              <Sparkles className="absolute -right-8 -top-8 w-6 h-6 text-green-700/40 animate-spin-slow" />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Your thoughts and ratings on the books you've read
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif relative overflow-hidden group"
            >
              <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/books">
                📚 <span>Books</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif relative overflow-hidden group"
            >
              <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/club-events">
              📅 <span>Events</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16 relative">
        {/* No Reviews Fallback */}
        {reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-6 p-12 rounded-xl bg-[#fffaf0] dark:bg-gray-800 border border-green-700 shadow-lg">
            <div className="relative">
              <Image width={200} height={200} src="/not-found.svg" alt="No reviews icon" className="opacity-80" />
              <BookMarked className="absolute -right-4 -bottom-4 w-12 h-12 text-green-700/30 animate-bounce" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-green-800 dark:text-green-500 font-serif">No Reviews Yet</p>
              <p className="text-gray-600 dark:text-gray-400 font-serif">
                Start sharing your thoughts on the books you've read!
              </p>
            </div>
            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif group"
            >
              <Link href="/books" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 transition-transform group-hover:scale-110" />
                Browse Books
              </Link>
            </Button>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {books.map(({ review, book }) => (
            <ReviewCard key={review?._id} review={review} book={book} />
          ))}
        </div>
      </div>
    </div>
  )
}