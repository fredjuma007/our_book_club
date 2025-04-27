import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BarChart3 } from "lucide-react"

export function StatsHeader() {
  return (
    <div className="bg-gradient-to-r from-green-100/80 to-blue-100/80 dark:from-green-900/50 dark:to-blue-900/50 py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 dark:bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        <div className="mb-6">
          <Button
            variant="outline"
            className="border-green-700 text-green-700 dark:text-green-500 hover:bg-green-700/10 dark:hover:bg-green-700/20 font-serif"
            asChild
          >
            <Link href="/books">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Books
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-green-700 dark:text-green-500" />
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-green-800 dark:text-green-500">
            Club Reading Stats
          </h1>
        </div>

        <p className="text-lg text-green-700/90 dark:text-green-400/90 max-w-2xl">
          Explore our book club's reading journey through data. Discover our favorite genres, most-read authors, and get
          AI-powered recommendations based on our collective taste.
        </p>
      </div>
    </div>
  )
}
