"use client"

import { ReviewCard } from "@/components/review-card"
import { BookOfMonth } from "@/components/dashboard/book-of-month"
import { CommunityFeed } from "@/components/dashboard/community-feed"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { ClubStatsSection } from "@/components/dashboard/club-stats-section"
import { Suspense } from "react"

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

interface Event {
  _id: string
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  meetingLink?: string
  isPast: boolean
}

interface MobileDashboardLayoutProps {
  userReviewsWithBooks: Array<{ review: Review; book: Book }>
  reviews: Review[]
  bookOfMonth: Book | null
  recentReviewsWithBooks: Array<{ review: Review; book: Book }>
  upcomingEvents: Event[]
  totalClubBooks: number
  totalClubReviews: number
  topRatedBook: Book & { avgRating: number; reviewCount: number }
  mostActiveMembers: Array<{ name: string; reviewCount: number }>
}

export function MobileDashboardLayout({
  userReviewsWithBooks,
  reviews,
  bookOfMonth,
  recentReviewsWithBooks,
  upcomingEvents,
  totalClubBooks,
  totalClubReviews,
  topRatedBook,
  mostActiveMembers,
}: MobileDashboardLayoutProps) {
  return (
    <div className="space-y-6">
      {/* 1. My Reviews */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-700/30 shadow-lg">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-500 font-serif mb-6 flex items-center gap-2">
          <span>📚</span> My Reviews
        </h2>
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 font-serif mb-4">No reviews yet</p>
            <a href="/books" className="text-green-700 dark:text-green-400 hover:underline font-serif font-semibold">
              Browse books to get started
            </a>
          </div>
        ) : (
          <div className="max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-100 dark:scrollbar-track-green-900/20">
            <div className="grid grid-cols-1 gap-4">
              {userReviewsWithBooks.map(({ review, book }) => (
                <ReviewCard key={review._id} review={review} book={book} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. Book of the Month */}
      {bookOfMonth && (
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
          <BookOfMonth book={bookOfMonth} />
        </Suspense>
      )}

      {/* 3. Community Feed */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
        <CommunityFeed recentReviews={recentReviewsWithBooks} />
      </Suspense>

      {/* 4. Upcoming Events */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
        <UpcomingEvents events={upcomingEvents} />
      </Suspense>

      {/* 5. Club Stats */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl" />}>
        <ClubStatsSection
          totalBooks={totalClubBooks}
          totalReviews={totalClubReviews}
          topRatedBook={topRatedBook}
          mostActiveMembers={mostActiveMembers}
        />
      </Suspense>
    </div>
  )
}
