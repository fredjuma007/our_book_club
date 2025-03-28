"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface Book {
  _id?: string
  title?: string
  author?: string
  genre?: string
  recommender?: string
  image?: any
  _createdDate?: string
  [key: string]: any
}

interface BooksFilterProps {
  books: any[]
  initialAuthor?: string
  initialGenre?: string
}

export function BooksFilter({ books, initialAuthor = "", initialGenre = "" }: BooksFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filter options
  const authors = [
    ...new Set(books.filter((book) => book?.author).map((book) => book.author || "Unknown Author")),
  ].sort()
  const genres = [...new Set(books.filter((book) => book?.genre).map((book) => book.genre || "Uncategorized"))].sort()

  // State for selected filters
  const [selectedAuthor, setSelectedAuthor] = useState(initialAuthor)
  const [selectedGenre, setSelectedGenre] = useState(initialGenre)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedAuthor) params.set("author", selectedAuthor)
    else params.delete("author")

    if (selectedGenre) params.set("genre", selectedGenre)
    else params.delete("genre")

    // Preserve existing search query if present
    const search = searchParams.get("search")
    if (search) params.set("search", search)

    // Update URL without refreshing the page
    router.push(`/books?${params.toString()}`)
  }, [selectedAuthor, selectedGenre, router, searchParams])

  return (
    <div className="w-full bg-[#f5f0e1] dark:bg-gray-900 p-4 rounded-lg mb-6 shadow-md border border-green-700">
      <div className="flex justify-start items-center mb-0">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="text-green-700 dark:text-white border-green-700 hover:bg-green-200 dark:hover:bg-green-800"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger className="bg-[#eae2d0] dark:bg-gray-800 text-green-700 dark:text-white border-green-700">
                <SelectValue placeholder="All Authors" />
              </SelectTrigger>
              <SelectContent className="bg-[#eae2d0] dark:bg-gray-800 text-green-700 dark:text-white border-green-700">
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="bg-[#eae2d0] dark:bg-gray-800 text-green-700 dark:text-white border-green-700">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent className="bg-[#eae2d0] dark:bg-gray-800 text-green-700 dark:text-white border-green-700">
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
      )}
    </div>
  )
}
