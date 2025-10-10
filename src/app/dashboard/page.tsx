import { getMember, getServerClient } from "@/lib/wix"
import { redirect } from "next/navigation"
import { WelcomeSection } from "@/components/dashboard/welcome-section"
import { MyStats } from "@/components/dashboard/my-stats"
import { ClubStatsSection } from "@/components/dashboard/club-stats-section"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { BookOfMonth } from "@/components/dashboard/book-of-month"
import { CommunityFeed } from "@/components/dashboard/community-feed"
import { ReviewCard } from "@/components/review-card"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Suspense } from "react"
import { convertWixEventData } from "@/lib/event-utils"

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic"
export const revalidate = 0

interface Review {
  _id: string
  name?: string
  rating?: number
  review?: string
  bookId?: string
  userId?: string
  authorId?: string
  memberId?: string
  _createdDate?: string
}

interface Book {
  _id?: string
  title?: string
  author?: string
  image?: any
  description?: string
  genre?: string
  rating?: number
  _createdDate?: string
}

export default async function DashboardPage() {
  const member = await getMember()

  if (!member) {
    redirect("/")
  }

  const client = await getServerClient()

  const [allReviewsResponse, allBooksResponse, eventsResponse] = await Promise.all([
    client.items.query("Reviews").find(),
    client.items.query("Books").find(),
    client.items
      .query("Events")
      .find()
      .catch(() => ({ items: [] })), // Gracefully handle if Events collection doesn't exist
  ])

  // Filter user's reviews
  const userReviews = allReviewsResponse.items.filter((item) => {
    return item.userId === member.id || item.authorId === member.id || item.memberId === member.id
  })

  const reviews = userReviews.map((item) => ({ ...item }) as Review)

  // Fetch book data for user's reviews
  const userReviewsWithBooks = await Promise.all(
    reviews
      .filter((review) => review?.bookId)
      .map(async (review) => {
        try {
          const bookResponse = await client.items.get("Books", review.bookId!)
          const book: Book = {
            _id: bookResponse?.["_id"] || review.bookId,
            title: bookResponse?.["title"] || "Unknown Title",
            author: bookResponse?.["author"],
            image: bookResponse?.["image"],
            description: bookResponse?.["description"],
            genre: bookResponse?.["genre"],
            _createdDate: bookResponse?.["_createdDate"]
              ? new Date(bookResponse["_createdDate"]).toISOString()
              : undefined,
          }
          return { review, book }
        } catch (error) {
          return {
            review,
            book: {
              _id: review.bookId,
              title: "Book Not Found",
              image: null,
            } as Book,
          }
        }
      }),
  )

  // Calculate user stats
  const totalReviews = reviews.length
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 0
  const lovedBooks = reviews.filter((r) => (r.rating || 0) >= 4).length

  // Calculate club stats
  const allReviews = allReviewsResponse.items.map((item) => ({ ...item }) as Review)
  const allBooks = allBooksResponse.items.map((item) => ({ ...item }) as Book)
  const totalClubReviews = allReviews.length
  const totalClubBooks = allBooks.length

  // Get top rated book
  const booksWithRatings = allBooks.map((book) => {
    const bookReviews = allReviews.filter((r) => r.bookId === book._id)
    const avgBookRating =
      bookReviews.length > 0 ? bookReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / bookReviews.length : 0
    return { ...book, avgRating: avgBookRating, reviewCount: bookReviews.length }
  })
  const topRatedBook = booksWithRatings.sort((a, b) => b.avgRating - a.avgRating)[0]

  // Get book of the month (most recent book)
  const bookOfMonth = allBooks.sort(
    (a, b) => new Date(b._createdDate || 0).getTime() - new Date(a._createdDate || 0).getTime(),
  )[0]

  const bookOfMonthWithStringDate = bookOfMonth
    ? {
        ...bookOfMonth,
        _createdDate: bookOfMonth._createdDate ? new Date(bookOfMonth._createdDate).toISOString() : undefined,
      }
    : null

  // Get recent community reviews (last 5, excluding user's own)
  const recentReviews = allReviews
    .filter((r) => r.userId !== member.id && r.authorId !== member.id && r.memberId !== member.id)
    .sort((a, b) => new Date(b._createdDate || 0).getTime() - new Date(a._createdDate || 0).getTime())
    .slice(0, 5)

  // Fetch book data for recent reviews
  const recentReviewsWithBooks = await Promise.all(
    recentReviews.map(async (review) => {
      try {
        const bookResponse = await client.items.get("Books", review.bookId!)
        const book: Book = {
          _id: bookResponse?.["_id"],
          title: bookResponse?.["title"] || "Unknown Title",
          author: bookResponse?.["author"],
          image: bookResponse?.["image"],
          _createdDate: bookResponse?.["_createdDate"]
            ? new Date(bookResponse["_createdDate"]).toISOString()
            : undefined,
        }
        return { review, book }
      } catch (error) {
        return {
          review,
          book: { _id: review.bookId, title: "Book Not Found", image: null } as Book,
        }
      }
    }),
  )

  const events = eventsResponse.items.map((item) => convertWixEventData(item))
  const currentDate = new Date()
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= currentDate && !event.isPast
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3) // Get next 3 upcoming events

  const memberReviewCounts = new Map<string, { name: string; count: number }>()

  allReviews.forEach((review) => {
    const memberName = review.name || "Anonymous"
    const existing = memberReviewCounts.get(memberName)
    if (existing) {
      existing.count++
    } else {
      memberReviewCounts.set(memberName, { name: memberName, count: 1 })
    }
  })

  const mostActiveMembers = Array.from(memberReviewCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((m) => ({ name: m.name, reviewCount: m.count }))

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <Suspense fallback={<div className="h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
          <WelcomeSection memberName={member.nickname || member.loginEmail || "Member"} />
        </Suspense>

        {/* My Stats */}
        <Suspense fallback={<div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
          <MyStats totalReviews={totalReviews} avgRating={avgRating} lovedBooks={lovedBooks} />
        </Suspense>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Reviews Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-700/30 shadow-lg">
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-500 font-serif mb-6 flex items-center gap-2">
                <span>📚</span> My Reviews
              </h2>
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 font-serif mb-4">No reviews yet</p>
                  <a
                    href="/books"
                    className="text-green-700 dark:text-green-400 hover:underline font-serif font-semibold"
                  >
                    Browse books to get started
                  </a>
                </div>
              ) : (
                <div className="max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-100 dark:scrollbar-track-green-900/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userReviewsWithBooks.map(({ review, book }) => (
                      <ReviewCard key={review._id} review={review} book={book} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Club Stats */}
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
              <ClubStatsSection
                totalBooks={totalClubBooks}
                totalReviews={totalClubReviews}
                topRatedBook={topRatedBook}
                mostActiveMembers={mostActiveMembers}
              />
            </Suspense>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Book of the Month */}
            {bookOfMonthWithStringDate && (
              <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
                <BookOfMonth book={bookOfMonthWithStringDate} />
              </Suspense>
            )}

            {/* Community Feed */}
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
              <CommunityFeed recentReviews={recentReviewsWithBooks} />
            </Suspense>

            {/* Upcoming Events */}
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
              <UpcomingEvents events={upcomingEvents} />
            </Suspense>
          </div>
        </div>

        <ScrollToTop />
      </div>
    </div>
  )
}
