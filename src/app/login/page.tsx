
import { getServerClient } from "@/lib/wix"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LoginButton } from "@/components/login-button"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  // Check if user is already logged in
  const client = await getServerClient()
  const isLoggedIn = client.auth.loggedIn()

  // If already logged in, redirect to home
  if (isLoggedIn) {
    redirect("/")
  }

  const error = searchParams.error

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-100 dark:border-green-900">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 relative mb-4">
            <Image
              src="/logo.jpeg"
              alt="Reading Circle Logo"
              width={80}
              height={80}
              className="rounded-full border-2 border-green-200 dark:border-green-800"
            />
          </div>
          <h1 className="text-3xl font-bold font-serif text-green-600 dark:text-green-400">Welcome Back</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to access your Reading Circle account</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            <p className="font-medium">Authentication failed</p>
            <p className="mt-1">Please try again or contact support if the problem persists.</p>
            <p className="mt-1 text-xs opacity-80">{error}</p>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <LoginButton />
        </div>
      </div>
    </div>
  )
}

