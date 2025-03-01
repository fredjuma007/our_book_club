import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { loginAction, logoutAction } from "./actions"
import { getMember, getServerClient } from "@/lib/wix"
import { ModeToggle } from "@/components/ModeToggle"

export async function Header() {
  const [member, client] = await Promise.all([getMember(), getServerClient()])
  const isLoggedIn = client.auth.loggedIn()

  return (
    <>
      {/* Fixed Header */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 
      fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-md bg-opacity-90 dark:bg-opacity-80">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8 py-3">
          {/* Logo and Title */}
          <Button variant="link" asChild>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
            >
              <Image 
                src="/logo.jpeg" 
                width={55} 
                height={55} 
                alt="TheBookClub" 
                className="rounded-full shadow-md hover:scale-105 transition-transform duration-300"
              />
              <span className="hidden md:inline text-3xl md:text-4xl lg:text-5xl font-bold text-transparent 
              bg-clip-text bg-gradient-to-r from-green-500 via-teal-400 to-purple-400 tracking-wide 
              transform transition-all duration-300 ease-in-out 
              hover:scale-105 md:hover:scale-110 hover:shadow-lg md:hover:shadow-xl">
                READING CIRCLE
              </span>
            </Link>
          </Button>

          {/* Mode Toggle */}
          <ModeToggle />

          <div className="flex items-center gap-4 md:gap-6">
            {/* Navigation Links */}
            <div className="md:flex items-center gap-6">
              <Button asChild variant="ghost" className="text-green-600 dark:text-green-400 
              hover:text-green-700 dark:hover:text-green-300 transition-colors">
                <Link href="/books">Books</Link>
              </Button>

              {isLoggedIn && (
                <Button asChild variant="ghost" className="text-green-600 dark:text-green-400 
                hover:text-green-700 
                dark:hover:text-green-300 transition-colors">
                  <Link href="/reviews">Reviews</Link>
                </Button>
              )}

              <Button asChild variant="ghost" className="text-green-600 dark:text-green-400 
              hover:text-green-700 dark:hover:text-green-300 transition-colors">
                <Link href="/about-us">About Us</Link>
              </Button>
            </div>

            {/* Authentication Button */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">
                    Hello, {member?.nickname}
                  </p>
                  <form action={logoutAction}>
                    <Button variant="outline" className="border-green-600 dark:border-green-400 
                    text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white 
                    dark:hover:bg-green-400 dark:hover:text-gray-900 transition-all">
                      Logout
                    </Button>
                  </form>
                </div>
              ) : (
                <form action={loginAction}>
                  <Button variant="outline" className="border-blue-600 dark:border-blue-400 
                  text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white 
                  dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all">
                    Login
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Padding to prevent content overlap */}
      <div className="pt-[75px]"></div>
    </>
  )
}
