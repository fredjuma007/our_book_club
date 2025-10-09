import { Suspense } from "react"
import { StatsHeader } from "@/components/stats/stats-header"
import { StatsOverview } from "@/components/stats/stats-overview"
import { GenreDistribution } from "@/components/stats/genre-distribution"
import { AuthorStats } from "@/components/stats/author-stats"
import { RatingStats } from "@/components/stats/rating-stats"
import { AIMoods } from "@/components/stats/ai-moods"
import { AIRecommendations } from "@/components/stats/ai-recommendations"
import { Skeleton } from "@/components/ui/skeleton"
import { getServerClient } from "@/lib/wix"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Define the IBook type
interface IBook {
  _id?: string
  title?: string
  author?: string
  genre?: string
  pageCount?: number
  rating?: number
  description?: string
  [key: string]: any
}

// Define the Review type
interface Review {
  _id: string
  bookId?: string
  rating?: number
  review?: string
  name?: string
  [key: string]: any
}

async function getClubStats() {
  try {
    const client = await getServerClient()

    // Fetch all books
    const booksResponse = await client.items.query("Books").find()

    // Fetch all reviews
    const reviewsResponse = await client.items.query("Reviews").find()

    return {
      books: booksResponse.items.map((item) => item),
      reviews: reviewsResponse.items.map((item) => item),
    }
  } catch (error) {
    console.error("Error fetching club stats:", error)
    return { books: [], reviews: [] }
  }
}

export default async function ClubStatsPage() {
  const { books, reviews } = await getClubStats()

  // Filter out null or undefined items and ensure they match the expected types
  const validBooks = books.filter((book): book is Required<IBook> => book !== null && book !== undefined && typeof book._id === "string")
  const validReviews = reviews.filter((review): review is Review => review !== null && review !== undefined)

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1121] text-green-700 dark:text-green-500 overflow-x-hidden selection:bg-green-700/30">
      {/* Animated particles - visible in both light and dark modes */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-10 dark:opacity-20" />

      <div className="relative z-10">
        <StatsHeader />

        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <Suspense fallback={<Skeleton className="h-40 w-full" />}>
            <StatsOverview books={validBooks} reviews={validReviews} />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <GenreDistribution books={validBooks} />
            </Suspense>

            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <AuthorStats books={validBooks} />
            </Suspense>
          </div>

          <div className="mt-12">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <RatingStats reviews={validReviews} books={validBooks} />
            </Suspense>
          </div>

          <div className="mt-12">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <AIMoods books={validBooks} />
            </Suspense>
          </div>

          <div className="mt-12 mb-16">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <AIRecommendations books={validBooks} reviews={validReviews} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
