import { getMember, getServerClient } from "@/lib/wix"
import { DashboardLanding } from "@/components/dashboard/dashboard-landing"
import { WelcomeSection } from "@/components/dashboard/welcome-section"
import { MyStats } from "@/components/dashboard/my-stats"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Suspense } from "react"
import { convertWixEventData } from "@/lib/event-utils"
import { MobileDashboardLayout } from "@/components/dashboard/mobile-dashboard-layout"
import { DesktopDashboardLayout } from "@/components/dashboard/desktop-dashboard-layout"

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
    return <DashboardLanding />
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

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MobileDashboardLayout
            userReviewsWithBooks={userReviewsWithBooks}
            reviews={reviews}
            bookOfMonth={bookOfMonthWithStringDate}
            recentReviewsWithBooks={recentReviewsWithBooks}
            upcomingEvents={upcomingEvents}
            totalClubBooks={totalClubBooks}
            totalClubReviews={totalClubReviews}
            topRatedBook={topRatedBook}
            mostActiveMembers={mostActiveMembers}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <DesktopDashboardLayout
            userReviewsWithBooks={userReviewsWithBooks}
            reviews={reviews}
            bookOfMonth={bookOfMonthWithStringDate}
            recentReviewsWithBooks={recentReviewsWithBooks}
            upcomingEvents={upcomingEvents}
            totalClubBooks={totalClubBooks}
            totalClubReviews={totalClubReviews}
            topRatedBook={topRatedBook}
            mostActiveMembers={mostActiveMembers}
          />
        </div>

        <ScrollToTop />
      </div>
    </div>
  )
}
