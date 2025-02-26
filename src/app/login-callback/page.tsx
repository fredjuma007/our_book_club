"use client"

import { useEffect } from "react"
import { loginCallbackAction } from "./actions"
import { useRouter } from "next/navigation"

export default function LoginCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = window.location.href
        const redirectUri = `${process.env.NEXT_PUBLIC_URL}/login-callback`
        await loginCallbackAction(url, redirectUri)
        router.push("/") // Redirect after successful login
      } catch (error) {
        console.error("Error during login callback:", error)
        router.push("/login?error=Authentication failed") // Redirect to login page with error
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-xl">1..2 Make a Circle </p>
        <p className="text-xl">3..4</p>
        <p className="text-xl">A</p>
        <p className="text-xl text-green-500">A READING CIRCLE</p>
      </div>
    </div>
  )
}

