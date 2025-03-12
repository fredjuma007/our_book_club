"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Calendar, Menu, X } from "lucide-react"
import Image from "next/image"

interface MobileMenuProps {
  isLoggedIn: boolean
  memberNickname?: string | null
  loginAction: () => Promise<void>
  logoutAction: () => Promise<void>
}

export function MobileMenu({ isLoggedIn, memberNickname, loginAction, logoutAction }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

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
        fixed top-[75px] right-0 w-64 max-h-fit bg-white dark:bg-gray-900 
        shadow-lg z-40 transform transition-transform duration-300 ease-in-out
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
          <div className="pt-2 pb-1">
            <h3 className="text-sm font-serif font-medium text-green-600 dark:text-green-400 mb-3 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Book of the Month
            </h3>

            <div className="relative bg-green-50 dark:bg-green-900/40 rounded-md p-3 border border-green-100 dark:border-green-800">
              {/* Paper texture */}
              <div className="absolute inset-0 bg-repeat opacity-10 dark:opacity-5 rounded-md" />

              <div className="flex gap-3">
                <div className="relative w-16 h-24 flex-shrink-0">
                  <div className="absolute inset-0 shadow-md rounded-sm overflow-hidden">
                    <Image
                      src="/sometimes i lie.jpg"
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
                  <h4 className="text-sm font-serif font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                    Sometimes I Lie
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Alice Feeney</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Review: March 29, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
