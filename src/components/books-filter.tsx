"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface Book {
  _id?: string
  title?: string
  author?: string
  genre?: string
  recommender?: string
  image?: any
  _createdDate?: string
  publishDate?: string
  [key: string]: any
}

interface BooksFilterProps {
  books: any[]
  initialAuthor?: string
  initialGenre?: string
  initialYear?: string
}

export function BooksFilter({ books, initialAuthor = "", initialGenre = "", initialYear = "all" }: BooksFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filter options
  const authors = [
    ...new Set(books.filter((book) => book?.author).map((book) => book.author || "Unknown Author")),
  ].sort()
  const genres = [...new Set(books.filter((book) => book?.genre).map((book) => book.genre || "Uncategorized"))].sort()

  // Extract years from books using the correct publishDate field
  const years = [
    ...new Set(
      books
        .filter((book) => book?.publishDate)
        .map((book) => {
          const date = new Date(book.publishDate)
          return !isNaN(date.getTime()) ? date.getFullYear().toString() : null
        })
        .filter((year): year is string => Boolean(year)),
    ),
  ].sort((a, b) => Number(b) - Number(a)) // Sort years in descending order (newest first)

  // State for selected filters
  const [selectedAuthor, setSelectedAuthor] = useState(initialAuthor)
  const [selectedGenre, setSelectedGenre] = useState(initialGenre)
  const [selectedYear, setSelectedYear] = useState(initialYear)

  // Count books for each year
  const yearCounts = years.reduce(
    (acc, year) => {
      acc[year] = books.filter(
        (book) => book?.publishDate && new Date(book.publishDate).getFullYear().toString() === year,
      ).length
      return acc
    },
    {} as Record<string, number>,
  )

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedAuthor && selectedAuthor !== "all") params.set("author", selectedAuthor)
    else params.delete("author")

    if (selectedGenre && selectedGenre !== "all") params.set("genre", selectedGenre)
    else params.delete("genre")

    if (selectedYear && selectedYear !== "all") params.set("year", selectedYear)
    else params.delete("year")

    // Preserve existing search query if present
    const search = searchParams.get("search")
    if (search) params.set("search", search)

    // Update URL without refreshing the page
    router.push(`/books?${params.toString()}`)
  }, [selectedAuthor, selectedGenre, selectedYear, router, searchParams])

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  const clearFilters = () => {
    setSelectedAuthor("all")
    setSelectedGenre("all")
    setSelectedYear("all")
  }

  // Check if any filters are active
  const hasActiveFilters =
    (selectedAuthor && selectedAuthor !== "all") ||
    (selectedGenre && selectedGenre !== "all") ||
    (selectedYear && selectedYear !== "all")

  return (
    <div className="mb-6">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Filters button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-9 ${
                  hasActiveFilters
                    ? "border-green-600 text-green-600 dark:border-green-500 dark:text-green-500"
                    : "border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-green-500 dark:hover:text-green-500"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
                {hasActiveFilters && (
                  <Badge className="ml-2 bg-green-600 dark:bg-green-700 text-[10px] px-1">Active</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-green-700 dark:text-green-500">Advanced Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-500 dark:hover:text-green-400 dark:hover:bg-green-900/20"
                    >
                      <X className="w-3 h-3 mr-1" /> Clear All
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Author</label>
                  <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 h-8 text-sm">
                      <SelectValue placeholder="All Authors" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all">All Authors</SelectItem>
                      {authors.map((author) => (
                        <SelectItem key={author} value={author}>
                          {author}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 h-8 text-sm">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Year tabs - always visible and compact */}
          <div className="flex-1 min-w-[200px]">
            <Tabs defaultValue={selectedYear} onValueChange={handleYearChange} className="w-full">
              <TabsList className="w-full bg-gray-100 dark:bg-gray-700 h-9 rounded-md">
                <TabsTrigger
                  value="all"
                  className="text-sm data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
                >
                  All Years
                </TabsTrigger>
                {years.length > 0 ? (
                  years.map((year) => (
                    <TabsTrigger
                      key={year}
                      value={year}
                      className="text-sm data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
                    >
                      {year}{" "}
                      {yearCounts[year] > 0 && <span className="ml-1 text-xs opacity-70">({yearCounts[year]})</span>}
                    </TabsTrigger>
                  ))
                ) : (
                  <>
                    <TabsTrigger
                      value="2025"
                      className="text-sm data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
                    >
                      2025
                    </TabsTrigger>
                    <TabsTrigger
                      value="2024"
                      className="text-sm data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md"
                    >
                      2024
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </Tabs>
          </div>

          {/* Active filter indicators */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              {selectedAuthor && selectedAuthor !== "all" && (
                <Badge
                  className="bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 dark:border-green-800"
                  onClick={() => setSelectedAuthor("all")}
                >
                  Author: {selectedAuthor} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {selectedGenre && selectedGenre !== "all" && (
                <Badge
                  className="bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 dark:border-green-800"
                  onClick={() => setSelectedGenre("all")}
                >
                  Genre: {selectedGenre} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
