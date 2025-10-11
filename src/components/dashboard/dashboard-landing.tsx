"use client"

import { Button } from "@/components/ui/button"
import { loginAction } from "@/app/actions"
import { BookOpen, Heart, Users, Calendar, MessageSquare, TrendingUp } from "lucide-react"

export function DashboardLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e1] via-[#fffaf0] to-[#f5f0e1] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 dark:bg-green-900/30 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/20 dark:bg-blue-900/30 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Your Personal{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                TRC 254 Dashboard
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
              Track your reading journey, connect with fellow book lovers, and never miss a club event. Your
              personalized dashboard awaits!
            </p>

            <div className="flex justify-center mb-12 sm:mb-16">
              <form action={loginAction}>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                >
                  Sign In to Access
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16 sm:pb-24">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Unlock These Features When You Join Our Community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Feature 1: My Stats */}
          <div className="group bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-700/30 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">My Stats</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Track books rated, favorites, average ratings. Watch your literary journey unfold
              with detailed analytics.
            </p>
          </div>

          {/* Feature 2: My Reviews */}
          <div className="group bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-700/30 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">My Reviews</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Edit, Delete and manage all your book reviews in one place. Share your thoughts with the TRC 254 community
            </p>
          </div>

          {/* Feature 3: Book of the Month */}
          <div className="group bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-700/30 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Book of the Month</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Stay updated with our monthly book selection. Join discussions and read along with the entire community.
            </p>
          </div>

          {/* Feature 4: Club Stats */}
          <div className="group bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-700/30 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Club Stats</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              See how active our community is with total members, books read, and reviews shared. Be part of something
              bigger.
            </p>
          </div>

          {/* Feature 5: Upcoming Events */}
          <div className="group bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-700/30 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Never miss a book club meeting, hangouts and Discussions. Get reminders and RSVP directly from your
              dashboard.
            </p>
          </div>

          {/* Feature 6: Community Feed */}
          <div className="group bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-700/30 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Community Feed</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover what other members are reading and reviewing. Engage with posts, share recommendations, and build
              connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
