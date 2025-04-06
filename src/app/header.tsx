import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { loginAction, logoutAction } from "./actions"
import { getMember, getServerClient } from "@/lib/wix"
import { ThemeToggle } from "@/components/ModeToggle"
import { MobileMenu } from "@/components/mobile-menu"
import { HeaderCountdown } from "@/components/header-countdown"

export async function Header() {
  const [member, client] = await Promise.all([getMember(), getServerClient()])
  const isLoggedIn = client.auth.loggedIn()

  return (
    <>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 overflow-hidden">
        <div className="absolute inset-0 bg-repeat opacity-10 dark:opacity-5" />
        <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_29px,rgba(22,163,74,0.1)_30px)] bg-[size:100%_30px] opacity-20 dark:opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-800/20 via-green-700/30 to-green-800/20" />
        <div className="absolute bottom-[3px] left-0 right-0 h-[1px] bg-white/30 dark:bg-white/10" />
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-green-800/20 dark:border-green-700/20 rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-green-800/20 dark:border-green-700/20 rounded-tr-sm" />
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-10 bg-green-600 dark:bg-green-700 rounded-b-sm shadow-md transform-gpu rotate-3 origin-top z-10 hidden lg:block">
          <div className="absolute inset-0 bg-repeat mix-blend-overlay opacity-20" />
        </div>

        <div className="container mx-auto flex justify-between items-center px-3 sm:px-4 md:px-8 py-2 sm:py-3 relative">
          <Button variant="link" asChild>
            <Link href="/" className="flex items-center gap-3 text-gray-900 dark:text-gray-100 group">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-green-100 dark:bg-green-900/30 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src="/logo.jpeg"
                  width={55}
                  height={55}
                  alt="TheBookClub"
                  className="rounded-full border-2 border-green-200 dark:border-green-800 shadow-md hover:scale-105 transition-transform duration-300 relative z-10 w-[45px] h-[45px] sm:w-[55px] sm:h-[55px]"
                />
                <div className="absolute -inset-1 rounded-full bg-green-100 dark:bg-green-800/30 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              </div>
              <div className="relative overflow-hidden">
                <span className="hidden sm:block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-500 to-green-400 tracking-wide relative group-hover:text-shadow-neon transition-all duration-300">
                  READING CIRCLE
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500 dark:via-green-400 to-transparent opacity-60" />
                </span>
                <span className="absolute inset-0 hidden md:block bg-gradient-to-r from-green-400/0 via-green-500/20 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="absolute inset-0 hidden md:block rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-green-400/0 via-green-500/30 to-green-400/0 blur-lg"></div>
                <div className="absolute -right-6 -top-3 w-5 h-5 text-green-600 dark:text-green-400 opacity-70 hidden lg:block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
              </div>
            </Link>
          </Button>

          <div className="hidden lg:flex items-center gap-2 lg:gap-4 xl:gap-6 relative z-10">
            <HeaderCountdown
              initialEventDate={new Date(2025, 2, 29, 19, 0, 0)}
              initialEventTitle="Book Club Meeting"
              initialEventTime="7:00 PM - 9:00 PM"
              initialEventLink="https://meet.google.com/vhv-hfwz-avi"
              initialBookTitle="Sometimes I Lie"
              initialBookCover="/sometimes i lie.jpg"
            />
            <ThemeToggle />

            <div className="flex items-center gap-3 lg:gap-6">
              <Button
                asChild
                variant="ghost"
                className="text-green-600 dark:text-green-400 hover:text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 dark:hover:text-green-300 transition-colors relative group overflow-hidden font-serif"
              >
                <Link href="/books">
                  <span className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  Books
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="text-green-600 dark:text-green-400 hover:text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 dark:hover:text-green-300 transition-colors relative group overflow-hidden font-serif"
              >
                <Link href="/about-us">
                  <span className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  About Us
                </Link>
              </Button>

              {isLoggedIn && (
                <Button
                  asChild
                  variant="ghost"
                  className="text-green-600 dark:text-green-400 hover:text-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 dark:hover:text-green-300 transition-colors relative group overflow-hidden font-serif"
                >
                  <Link href="/reviews">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    My Reviews
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <p className="text-sm text-gray-800 dark:text-gray-300 font-medium font-serif">
                      Hello,{" "}
                      <span className="text-green-600 dark:text-green-400 relative">
                        {member?.nickname}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500 dark:via-green-400 to-transparent" />
                      </span>
                    </p>
                    <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/30 dark:via-green-400/30 to-transparent" />
                  </div>
                  <form action={logoutAction}>
                    <Button
                      variant="outline"
                      className="border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-gray-900 transition-all relative overflow-hidden group font-serif"
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
                    className="border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all relative overflow-hidden group font-serif"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <span className="relative z-10">Login</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </form>
              )} */}
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-2 z-10">
            <HeaderCountdown
              initialEventDate={new Date(2025, 2, 29, 19, 0, 0)}
              initialEventTitle="Book Club Meeting"
              initialEventTime="7:00 PM - 9:00 PM"
              initialEventLink="https://meet.google.com/vhv-hfwz-avi"
              initialBookTitle="Sometimes I Lie"
              initialBookCover="/sometimes i lie.jpg"
            />
            <ThemeToggle />
            <MobileMenu
              isLoggedIn={isLoggedIn}
              memberNickname={member?.nickname}
              loginAction={loginAction}
              logoutAction={logoutAction}
            />
          </div>
        </div>
      </div>

      <div className="pt-[65px] sm:pt-[70px] lg:pt-[75px]"></div>
    </>
  )
}
