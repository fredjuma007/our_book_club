"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)

      // Direct fetch to the login action endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // If we get a redirect response, manually redirect the browser
      if (response.redirected) {
        window.location.href = response.url
      } else {
        // Handle non-redirect responses
        const data = await response.json()
        if (data.error) {
          console.error("Login error:", data.error)
        }
      }
    } catch (error) {
      console.error("Login request failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors relative overflow-hidden group"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          Connecting...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
          Sign in again
        </span>
      )}
    </Button>
  )
}

