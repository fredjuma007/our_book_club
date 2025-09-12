"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Bookmark, Coffee, Shirt, Grid3X3, Book } from "lucide-react"

interface CategoryFilterProps {
  merchandise: Array<{
    category?: string
  }>
  initialCategory: string
}

export function CategoryFilter({ merchandise, initialCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categories = Array.from(
    new Set(
      merchandise
        .map((item) => item.category)
        .filter((category): category is string => typeof category === "string" && category.length > 0)
    )
  )

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/store?${params.toString()}`)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bookmark":
        return <Bookmark className="w-4 h-4" />
      case "mug":
        return <Coffee className="w-4 h-4" />
      case "t-shirt":
        return <Shirt className="w-4 h-4" />
      default:
        return <Grid3X3 className="w-4 h-4" />
        case "book":
            return <Book  className="w-4 h-4" />
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!initialCategory || initialCategory === "all" ? "default" : "outline"}
        onClick={() => handleCategoryChange("all")}
        className={`font-serif ${
          !initialCategory || initialCategory === "all"
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
        }`}
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        All Products
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          variant={initialCategory === category ? "default" : "outline"}
          onClick={() => handleCategoryChange(category)}
          className={`font-serif capitalize ${
            initialCategory === category
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          {getCategoryIcon(category)}
          <span className="ml-2">{category}s</span>
        </Button>
      ))}
    </div>
  )
}
