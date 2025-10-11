import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function StatsHeader() {
  return (
    <div className="bg-gradient-to-r from-green-100/80 to-blue-100/80 dark:from-green-900/50 dark:to-blue-900/50 py-6 relative overflow-hidden border-b border-green-200/50 dark:border-green-800/50">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 dark:opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 dark:bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center gap-3">
          {/* Centered Title */}
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-green-800 dark:text-green-500">
            Club Statistics
          </h1>

          {/* My Dashboard button below */}
          <Button
            variant="outline"
            size="sm"
            className="border-green-700/30 text-green-700 dark:text-green-400 hover:bg-green-700/10 dark:hover:bg-green-700/20 font-serif bg-transparent"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>My Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
