"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Calendar, Menu, X, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import { events } from "@/data/events"

interface MobileMenuProps {
  isLoggedIn: boolean
  memberNickname?: string | null
  loginAction: () => Promise<void>
  logoutAction: () => Promise<void>
}

export function MobileMenu({ isLoggedIn, memberNickname, loginAction, logoutAction }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Get the first upcoming event
  const upcomingEvent = events.length > 0 ? events[0] : null

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 text-green-600/90 dark:text-green-400/90 hover:text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 dark:hover:text-green-300 transition-colors group overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        {isOpen ? <X className="h-5 w-5 relative z-10" /> : <Menu className="h-5 w-5 relative z-10" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      {/* Mobile menu panel */}
      <div
        className={`
    fixed top-[65px] sm:top-[70px] lg:top-[75px] right-0 w-64 sm:w-80 max-h-[calc(100vh-65px)] sm:max-h-[calc(100vh-70px)] lg:max-h-[calc(100vh-75px)] overflow-y-auto
    bg-white dark:bg-gray-900 shadow-lg z-40 transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
    border-l border-green-100 dark:border-green-900 rounded-bl-md
  `}
      >
        {/* Paper texture background */}
        <div className="absolute inset-0 bg-repeat opacity-10 dark:opacity-5 rounded-bl-md" />

        {/* Book page lines */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_29px,rgba(22,163,74,0.1)_30px)] bg-[size:100%_30px] opacity-20 dark:opacity-10" />

        <div className="flex flex-col p-4 gap-4 relative z-10">
          {/* Navigation Links */}
          <div className="flex flex-col gap-2 border-b border-green-100 dark:border-green-900 pb-4">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-green-600 dark:text-green-400 
              hover:text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20
              dark:hover:text-green-300 transition-colors relative group overflow-hidden font-serif"
            >
              <Link href="/books">
                <span className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                Books
              </Link>
            </Button>

            {isLoggedIn && (
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-green-600 dark:text-green-400 
                hover:text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20
                dark:hover:text-green-300 transition-colors relative group overflow-hidden font-serif"
              >
                <Link href="/reviews">
                  <span className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  My Reviews
                </Link>
              </Button>
            )}
          </div>

          {/* Authentication */}
          <div className="pt-2 border-b border-green-100 dark:border-green-900 pb-4">
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <p className="text-sm text-gray-800 dark:text-gray-300 font-medium font-serif">
                    Hello,{" "}
                    <span className="text-green-600 dark:text-green-400 relative">
                      {memberNickname}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500 dark:via-green-400 to-transparent" />
                    </span>
                  </p>
                  <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 dark:via-green-400/30 to-transparent" />
                </div>
                <form action={logoutAction}>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 dark:border-green-400 
                    text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white 
                    dark:hover:bg-green-400 dark:hover:text-gray-900 transition-all relative overflow-hidden group font-serif"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <span className="relative z-10">Logout</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </form>
              </div>
            ) : (
              <form action={loginAction}>
                <Button
                  variant="outline"
                  className="w-full border-blue-600 dark:border-blue-400 
                  text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white 
                  dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all relative overflow-hidden group font-serif"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </form>
            )}
          </div>

          {/* Book of the Month */}
          <div className="pt-2 pb-1 border-b border-green-100 dark:border-green-900">
            <h3 className="text-xs sm:text-sm font-serif font-medium text-green-600 dark:text-green-400 mb-2 sm:mb-3 flex items-center">
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Book of the Month
            </h3>

            <Link
              href="https://readingcircle.vercel.app/books/0ff3b310-acd6-4a8d-b468-6542a9f818e0"
              className="relative block"
            >
              <div className="relative bg-green-50 dark:bg-green-900/40 rounded-md p-2 sm:p-3 border border-green-100 dark:border-green-800 mb-3 sm:mb-4 hover:bg-green-100/50 dark:hover:bg-green-800/50 transition-colors">
                {/* Paper texture */}
                <div className="absolute inset-0 bg-repeat opacity-10 dark:opacity-5 rounded-md" />

                <div className="flex gap-2 sm:gap-3">
                  <div className="relative w-12 h-18 sm:w-16 sm:h-24 flex-shrink-0">
                    <div className="absolute inset-0 shadow-md rounded-sm overflow-hidden">
                      <Image
                        src="/the_anxious_generation.jpg"
                        width={64}
                        height={96}
                        alt="Book cover"
                        className="object-cover"
                      />
                    </div>
                    {/* Book edge effect */}
                    <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xs sm:text-sm font-serif font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                      Sometimes I Lie
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                      Alice Feeney
                    </p>
                    <div className="flex items-center mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">
                      <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      <span>Review: March 29, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Upcoming Event */}
          {upcomingEvent && (
            <div className="pt-2 pb-1">
              <h3 className="text-xs sm:text-sm font-serif font-medium text-green-600 dark:text-green-400 mb-2 sm:mb-3 flex items-center">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Upcoming Event
              </h3>

              <div className="relative bg-green-50 dark:bg-green-900/40 rounded-md overflow-hidden border border-green-100 dark:border-green-800">
                {/* Paper texture */}
                <div className="absolute inset-0 bg-repeat opacity-10 dark:opacity-5 rounded-md" />

                <div className="relative h-24 sm:h-32">
                  <Image
                    src={upcomingEvent.imageUrl || "/placeholder.svg"}
                    alt={upcomingEvent.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-1.5 sm:p-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-serif">{upcomingEvent.title}</h4>
                      <p className="text-green-300 font-serif text-[10px] sm:text-xs">
                        {upcomingEvent.bookTitle !== "TBA" ? upcomingEvent.bookTitle : "Book to be announced"}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-green-700/90 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-serif backdrop-blur-sm">
                    {upcomingEvent.type}
                  </div>
                </div>

                <div className="p-1.5 sm:p-2">
                  <div className="grid grid-cols-2 gap-0.5 sm:gap-1 text-gray-600 dark:text-gray-300 font-serif text-[10px] sm:text-xs">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-700" />
                      <span>{upcomingEvent.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-700" />
                      <span>{upcomingEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 col-span-2">
                      <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-700" />
                      <span>{upcomingEvent.location}</span>
                    </div>
                  </div>

                  {upcomingEvent.link ? (
                    <Button
                      asChild
                      size="sm"
                      className="w-full mt-1.5 sm:mt-2 bg-green-700 hover:bg-green-800 text-white text-[10px] sm:text-xs py-1 h-auto sm:h-8 transition-all duration-300 font-serif relative overflow-hidden group/btn"
                    >
                      <Link href={upcomingEvent.link} target="_blank" rel="noopener noreferrer">
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        Join Discussion
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      className="w-full mt-1.5 sm:mt-2 bg-green-700 hover:bg-green-800 text-white text-[10px] sm:text-xs py-1 h-auto sm:h-8 transition-all duration-300 font-serif relative overflow-hidden group/btn"
                    >
                      <Link
                        href="https://wa.me/+254790964291?text=Hello%20Reading%20Circle%20Event%20Coordinator,%20I'm%20contacting%20from%20the%20website.%20I%20would%20like%20to%20know%20more%20about%20the%20upcoming%20bookclub%20events%20and%20discussions"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        Inquire More
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
