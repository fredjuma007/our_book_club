import { Suspense } from "react"
import { StatsOverview } from "@/components/stats/stats-overview"
import { GenreDistribution } from "@/components/stats/genre-distribution"
import { AuthorStats } from "@/components/stats/author-stats"
import { RatingStats } from "@/components/stats/rating-stats"
import { AIMoods } from "@/components/stats/ai-moods"

import { Skeleton } from "@/components/ui/skeleton"

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

interface BookStatsSectionProps {
  books: IBook[]
  reviews: Review[]
}

export function BookStatsSection({ books, reviews }: BookStatsSectionProps) {
  // Filter out null or undefined items and ensure they match the expected types
  const validBooks = books.filter(
    (book): book is Required<IBook> => book !== null && book !== undefined && typeof book._id === "string",
  )
  const validReviews = reviews.filter((review): review is Review => review !== null && review !== undefined)

  return (
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
            {/* AI-generated insights */}
        </Suspense>
      </div>
    </div>
  )
}
