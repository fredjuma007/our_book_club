"use client"

import type React from "react"

import { useState } from "react"
import { Search, Sparkles, Loader2, BookOpen, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { semanticSearch } from "@/lib/search-action"
import type { BookWithMatch } from "@/lib/book-types"
import Link from "next/link"

export function SemanticSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BookWithMatch[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setShowResults(true)
    setError(null)

    try {
      const searchResults = await semanticSearch(query)
      setResults(searchResults)

      // Show error message if no results found
      if (searchResults.length === 0) {
        setError("No books matching your query were found. Try different keywords or browse our collection.")
      }
    } catch (error) {
      console.error("Search error:", error)
      setError("Something went wrong with the search. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const closeResults = () => {
    setShowResults(false)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2 w-full">
        <div className="relative flex-grow">
          <Input
            name="search"
            type="text"
            placeholder="Try 'books with magic'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:text-white pr-10"
          />
          <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-600 dark:text-purple-500" />
        </div>
        <Button
          type="submit"
          disabled={isSearching}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 
          hover:to-blue-600 font-serif group relative overflow-hidden shadow-lg hover:shadow-xl 
          transition-all duration-300"
        >
          {isSearching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
          Search
        </Button>
      </form>

      {showResults && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-500 font-serif flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-green-600" />
                AI-Powered Search Results
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isSearching ? "Finding the perfect books for you..." : `Top matches for "${query}"`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeResults}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {isSearching ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <div className="mt-4">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400" />
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {results.map((book, index) => (
                <div
                  key={book._id}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-500">{book.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                    </div>
                    <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">
                      Match: {Math.round(book.matchScore * 100)}%
                    </div>
                  </div>

                  {book.matchReason && (
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 italic border-l-2 border-green-500 pl-3 py-1">
                      {book.matchReason}
                    </p>
                  )}

                  {book.tags && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {book.tags.mood?.map((tag) => (
                        <span
                          key={`mood-${tag}`}
                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {book.tags.themes?.map((tag) => (
                        <span
                          key={`theme-${tag}`}
                          className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {book.tags.discussion_topics?.map((tag) => (
                        <span
                          key={`topic-${tag}`}
                          className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-500 dark:border-green-500 dark:hover:bg-green-900/20"
                    >
                      <Link href={`/books/${book._id}`} className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 mr-1" /> View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No matching books found. Try a different query.</p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="p-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 bg-purple-100 dark:bg-purple-900 rounded-b-lg">
              Powered by Gladwell AI ✨
            </div>
          )}
        </div>
      )}
    </div>
  )
}
