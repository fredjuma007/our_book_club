"use client"

import { useEffect } from "react"
import { loginCallbackAction } from "./actions"
import { useRouter } from "next/navigation"
import { LoadingScreen } from "@/components/loading-screen"

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

  return <LoadingScreen message="Authenticating..." submessage="We're logging you in. This will only take a moment." />
}
