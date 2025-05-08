"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarRange } from "lucide-react"

export function YearTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the current year filter or default to "all"
  const currentYear = searchParams.get("year") || "all"

  const handleYearChange = (year: string) => {
    // Create a new URLSearchParams instance
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove the year parameter
    if (year === "all") {
      params.delete("year")
    } else {
      params.set("year", year)
    }

    // Navigate to the new URL
    router.push(`/books?${params.toString()}`)
  }

  return (
    <div className="w-full bg-[#f5f0e1] dark:bg-gray-900 p-4 rounded-lg mb-6 shadow-md border border-green-700">
      <div className="flex items-center gap-2 mb-2">
        <CalendarRange className="w-5 h-5 text-green-700 dark:text-green-500" />
        <h3 className="text-lg font-serif text-green-800 dark:text-green-500">Filter by Year</h3>
      </div>

      <Tabs defaultValue={currentYear} onValueChange={handleYearChange} className="w-full">
        <TabsList className="w-full bg-[#eae2d0] dark:bg-gray-800 border border-green-700">
          <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-green-700 data-[state=active]:text-white">
            All Years
          </TabsTrigger>
          <TabsTrigger value="2025" className="flex-1 data-[state=active]:bg-green-700 data-[state=active]:text-white">
            2025
          </TabsTrigger>
          <TabsTrigger value="2024" className="flex-1 data-[state=active]:bg-green-700 data-[state=active]:text-white">
            2024
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
