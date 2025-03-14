import Image from "next/image"
import { BookIcon, ChevronLeft, StarIcon, BookOpen, Calendar, User, MessageCircle } from "lucide-react"
import { PostReviewForm } from "./post-review-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getServerClient, getMember } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { notFound } from "next/navigation"
import { loginAction } from "@/app/actions"
import type { Metadata } from "next"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ReviewItem } from "./ReviewItem"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ShareButton from "@/components/sharebutton"

// This forces the page to be dynamically rendered and not cached
export const dynamic = "force-dynamic"
export const revalidate = 0

interface Review {
  _id: string
  name: string
  rating: number
  review: string
  bookId: string
  likes?: number
}

interface Book {
  _id: string
  title: string
  author: string
  publisher?: string // This will be used as the recommender
  description?: string
  image?: any
  goodreadsUrl?: string
  genre?: string
  reviewDate?: string
}

interface PageProps {
  params: { bookId: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await params before using them
  const paramsObj = await params

  return {
    title: `Book Details - ${paramsObj.bookId}`,
  }
}

export default async function Page({ params }: PageProps) {
  // Await params before using them
  const paramsObj = await params
  const bookId = paramsObj.bookId

  const [client, member] = await Promise.all([getServerClient(), getMember()])
  const isLoggedIn = await client.auth.loggedIn()

  try {
    // Add a cache-busting timestamp to ensure fresh data
    const timestamp = Date.now()

    const [bookResponse, reviewsResponse] = await Promise.all([
      client.items.getDataItem(bookId, {
        dataCollectionId: "Books",
      }),
      client.items
        .queryDataItems({
          dataCollectionId: "Reviews",
        })
        .eq("bookId", bookId)
        .find(),
    ])

    const book = bookResponse?.data as Book | undefined

    // Extract reviews with proper mapping
    const reviews = reviewsResponse.items.map((item) => {
      const reviewData = item.data || {}
      return {
        _id: item._id,
        name: reviewData.name || "Anonymous",
        rating: reviewData.rating || 3,
        review: reviewData.review || "",
        bookId: reviewData.bookId || bookId,
      } as Review
    })

    // Calculate average rating
    const averageRating =
      reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

    if (!book) {
      return notFound()
    }

    return (
      <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 selection:bg-green-700/30">
        {/* Hero Section with Book Cover */}
        <div className="relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

          {/* Background Image Overlay */}
          {book.image && (
            <div className="absolute inset-0 w-full h-full">
              <div className="relative w-full h-full opacity-60">
                <Image
                  src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e1]/80 to-[#f5f0e1] dark:from-gray-900/80 dark:to-gray-900"></div>
            </div>
          )}

          <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
            {/* Back Button */}
            <div className="mb-8">
              <Button
                variant="outline"
                className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group relative overflow-hidden"
                asChild
              >
                <Link href="/books">
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ChevronLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
                  Back to Books
                </Link>
              </Button>
            </div>

            {/* Book Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Book Cover */}
              <div className="relative">
                {book.image ? (
                  <div className="relative w-[200px] h-[300px] group">
                    <Image
                      width={200}
                      height={300}
                      src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                      alt={book.title}
                      className="rounded-lg object-cover shadow-lg border-2 border-green-700 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-[200px] h-[300px] rounded-lg bg-[#fffaf0] dark:bg-gray-800 border-2 border-green-700 shadow-lg">
                    <BookIcon className="w-16 h-16 text-green-700/50" />
                    <p className="text-green-700 dark:text-green-400 font-serif mt-2">No Cover Available</p>
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-green-700 text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                  <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
                  <div className="flex">
                    <StarIcon className="w-3 h-3 fill-yellow-300" />
                    <StarIcon className="w-3 h-3 fill-yellow-300" />
                    <StarIcon className="w-3 h-3 fill-yellow-300" />
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 space-y-4">
                <h1 className="text-4xl font-bold text-green-800 dark:text-green-500 font-serif relative inline-block group">
                  {book.title}
                  <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </h1>
                <h2 className="text-2xl text-green-700 dark:text-green-400 font-serif">by {book.author}</h2>

                <div className="flex flex-wrap gap-3 mt-4">
                  {book.genre && (
                    <span className="px-3 py-1 bg-green-700/10 text-green-800 dark:text-green-400 rounded-full text-sm font-serif border border-green-700/30 flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {book.genre}
                    </span>
                  )}
                  {book.reviewDate && (
                    <span className="px-3 py-1 bg-green-700/10 text-green-800 dark:text-green-400 rounded-full text-sm font-serif border border-green-700/30 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {book.reviewDate}
                    </span>
                  )}
                  {book.publisher && (
                    <span className="px-3 py-1 bg-green-700/10 text-green-800 dark:text-green-400 rounded-full text-sm font-serif border border-green-700/30 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Recommended by {book.publisher}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-green-700/10 text-green-800 dark:text-green-400 rounded-full text-sm font-serif border border-green-700/30 flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {book.goodreadsUrl && (
                    <Button
                      asChild
                      className="bg-green-700 hover:bg-green-800 text-white transition-all duration-300 font-serif relative overflow-hidden group/btn"
                    >
                      <a href={book.goodreadsUrl} target="_blank" rel="noopener noreferrer">
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        View on Goodreads
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group relative overflow-hidden"
                    asChild
                  >
                    <a href="#post-review">
                      <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <StarIcon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                      Write a Review
                    </a>
                  </Button>
                  <ShareButton />
                  
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
        </div>

        {/* Main Content */}
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-12 relative space-y-12">
          {/* Book Description */}
          <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 overflow-hidden transition-all duration-300 hover:shadow-xl p-6 md:p-8 group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-green-700" />
              About This Book
            </h2>

            <div className="prose prose-green dark:prose-invert max-w-none font-serif">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {book.description || "No description available for this book."}
              </p>
            </div>
          </div>

          {/* Review Form */}
        <Card
          id="post-review" 
          className="relative rounded-lg shadow-md bg-white/70 dark:bg-gray-800/70 border border-green-700 backdrop-blur-md transition-all hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif">
              ⭐ Rate & Post a Review ⭐
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoggedIn && member ? (
              <PostReviewForm bookId={book._id} userName={member.nickname || member.loginEmail || "Anonymous"} />
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400 font-serif">Please log in to post a review</p>
                <form action={loginAction}>
                  <Button
                    variant="outline"
                    className="bg-green-700 text-white hover:bg-green-800 transition-all font-serif"
                  >
                    Login to Review
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

           {/* Reviews Section */}
        <Card className="relative rounded-lg shadow-md bg-white/70 dark:bg-gray-800/70 border border-green-700 backdrop-blur-md transition-all hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif">
              Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewItem
                    key={review._id}
                    id={review._id}
                    name={review.name}
                    rating={review.rating}
                    review={review.review}
                    isLoggedIn={isLoggedIn}
                    bookId={bookId}
                    currentUserId={member?.id ?? undefined}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 font-serif">
                  No reviews available. Be the first to review this book!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Scroll to Top Button */}
        <ScrollToTop />
        <Toaster />
      </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching book data:", error)
    return notFound()
  }
}
