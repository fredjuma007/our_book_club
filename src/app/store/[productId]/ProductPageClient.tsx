"use client"

import Image from "next/image"
import { ChevronLeft, ShoppingCart, Phone, Package, Star, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  description?: string
  image?: any
  inStock: boolean
  featured: boolean
}

interface ProductPageClientProps {
  product: Product
}

function ProductPageClient({ product }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change))
  }

  const addToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("bookClubCart") || "[]")

    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item._id === product._id)

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity
    } else {
      // Add new item to cart
      existingCart.push({
        ...product,
        quantity,
      })
    }

    // Save to localStorage
    localStorage.setItem("bookClubCart", JSON.stringify(existingCart))

    // Navigate to cart page
    router.push("/cart")
  }

  const categoryEmoji =
    {
      bookmark: "🔖",
      mug: "☕",
      "t-shirt": "👕",
    }[product.category] || "📦"

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 selection:bg-green-700/30">
      {/* Hero Section with Product Image */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        {/* Background Image Overlay */}
        {product.image && (
          <div className="absolute inset-0 w-full h-full">
            <div className="relative w-full h-full opacity-60">
              <Image
                src={convertWixImageToUrl(product.image) || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e1]/80 to-[#f5f0e1] dark:from-gray-900/80 dark:to-gray-900"></div>
          </div>
        )}

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group relative overflow-hidden bg-transparent"
              asChild
            >
              <Link href="/store">
                <span className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ChevronLeft className="mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Store
              </Link>
            </Button>
          </div>

          {/* Product Header */}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Product Image */}
            <div className="relative lg:w-1/2">
              {product.image ? (
                <div className="relative w-full max-w-md mx-auto aspect-square group">
                  <Image
                    fill
                    src={convertWixImageToUrl(product.image) || "/placeholder.svg"}
                    alt={product.name}
                    className="rounded-2xl object-cover shadow-2xl border-4 border-green-700 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-full max-w-md mx-auto aspect-square rounded-2xl bg-[#fffaf0] dark:bg-gray-800 border-4 border-green-700 shadow-2xl">
                  <Package className="w-24 h-24 text-green-700/50" />
                  <p className="text-green-700 dark:text-green-400 font-serif mt-4 text-lg">No Image Available</p>
                </div>
              )}

              {/* Stock Badge */}
              <div className="absolute -top-4 -right-4">
                <Badge
                  variant={product.inStock ? "default" : "destructive"}
                  className={`text-white font-serif text-sm px-4 py-2 ${
                    product.inStock ? "bg-green-700 hover:bg-green-800" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute -top-4 -left-4">
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-serif text-sm px-4 py-2">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{categoryEmoji}</span>
                  <Badge variant="outline" className="border-green-700 text-green-700 dark:text-green-400 font-serif">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-green-800 dark:text-green-500 font-serif relative inline-block group">
                  {product.name}
                  <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </h1>
              </div>

              <div className="text-4xl font-bold text-green-700 dark:text-green-400 font-serif">
                KES {product.price.toLocaleString()}
              </div>

              {/* Quantity Selector */}
              <Card className="bg-white/70 dark:bg-gray-800/70 border border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-serif text-green-800 dark:text-green-400">Quantity:</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-700 text-green-700 hover:bg-green-100 dark:hover:bg-gray-700 bg-transparent"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-xl font-bold text-green-800 dark:text-green-400 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-700 text-green-700 hover:bg-green-100 dark:hover:bg-gray-700 bg-transparent"
                        onClick={() => handleQuantityChange(1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  size="lg"
                  disabled={!product.inStock}
                  onClick={addToCart}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-serif text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ShoppingCart className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-gray-700 font-serif text-lg py-6 group relative overflow-hidden bg-transparent"
                  asChild
                >
                  <a href="tel:+254700000000">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Phone className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:rotate-12" />
                    Order via Call: +254 700 000 000
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
      </div>

      {/* Product Description */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-12">
        <Card className="bg-[#fffaf0] dark:bg-gray-800 border border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif flex items-center">
              <Package className="w-6 h-6 mr-2 text-green-700" />
              Product Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="prose prose-green dark:prose-invert max-w-none font-serif">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {product.description ||
                  `This ${product.category} is perfect for any book lover! Made with high-quality materials and featuring our signature book club design.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProductPageClient
