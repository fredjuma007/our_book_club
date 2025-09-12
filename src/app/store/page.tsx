import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Coffee, Bookmark, Shirt, Sparkles, Phone, Star } from "lucide-react"
import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { CategoryFilter } from "@/components/category-filter"
import { CartButton } from "@/components/cart-button"

export default async function StorePage({
  searchParams,
}: {
  searchParams: {
    category?: string
  }
}) {
  await searchParams
  const client = await getServerClient()

  const merchandiseData = await client.items
    .queryDataItems({ dataCollectionId: "Merchandise" })
    .find()
    .then((res) => {
      console.log("[v0] Raw merchandise data from Wix:", JSON.stringify(res.items.slice(0, 1), null, 2))
      return res.items.map((item) => {
        const mappedItem = {
          _id: item.data?._id,
          name: item.data?.title_fld, // Map title_fld to name
          category: item.data?.category,
          price: item.data?.price,
          description: item.data?.description_fld, // Map description_fld to description
          image: item.data?.image_fld, // Map image_fld to image
          inStock: item.data?.inStock,
          featured: item.data?.featured,
        }
        console.log("[v0] Processing item:", mappedItem._id, "Image data:", mappedItem.image)
        return mappedItem
      })
    })
    .catch((error) => {
      console.error("Error fetching merchandise:", error)
      return []
    })

  // Filter out any null or undefined values
  const merchandise = merchandiseData.filter(
    (
      item,
    ): item is {
      _id: string
      name: string
      category: string
      price: number
      description: string
      image: any
      inStock: boolean
      featured: boolean
    } => !!item && typeof item === "object",
  )

  const categoryFilter = (await searchParams).category || ""

  // Apply category filter
  const filteredMerchandise = merchandise.filter((item) => {
    return !categoryFilter || categoryFilter === "all" || item?.category === categoryFilter
  })

  // Sort by featured first, then by newest
  const sortedMerchandise = filteredMerchandise.sort((a, b) => {
    if (a?.featured && !b?.featured) return -1
    if (!a?.featured && b?.featured) return 1
    return 0
  })

  const featuredItems = merchandise.filter((item) => item?.featured)

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#059669_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#10b981_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          <div className="absolute right-10 top-10 hidden lg:block animate-[bounce_6s_ease-in-out_infinite]">
            <ShoppingBag className="w-16 h-16 text-emerald-700/30 transform rotate-12" />
          </div>
          <div className="absolute left-20 bottom-10 hidden lg:block animate-[bounce_8s_ease-in-out_infinite]">
            <Coffee className="w-12 h-12 text-emerald-700/20 transform -rotate-12" />
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-emerald-800 dark:text-emerald-500 font-serif mb-4 relative inline-block group">
              <span className="absolute -inset-1 bg-emerald-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              TRC 254 Store 🛍️
              <Sparkles className="absolute -right-8 -top-8 w-6 h-6 text-emerald-700/40" />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto mb-8">
              Show your love for reading with our exclusive book club merchandise! 
              From stylish bookmarks to amazing t-shirts and mugs.
              Every purchase supports our community initiatives. Happy shopping!
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-serif px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="#products">Shop Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-serif px-8 py-3 rounded-full bg-transparent"
                asChild
              >
                <Link href="tel:+254700000000">
                  <Phone className="w-4 h-4 mr-2" />
                  Order by Call
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16 relative">
        {/* Featured Products Section */}
        {featuredItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-500 font-serif mb-6 text-center">
              ⭐ Featured Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredItems.slice(0, 3).map((item) => (
                <Card
                  key={item?._id}
                  className="hover:shadow-xl transition-all duration-300 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-700 group hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-emerald-600 text-white font-serif">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-emerald-800 dark:text-emerald-500 font-serif group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {item?.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400 font-serif capitalize">
                      {item?.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center pt-4">
                    {item?.image ? (
                      <div className="relative w-full h-48 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg" />
                        <Image
                          width={200}
                          height={200}
                          src={
                            convertWixImageToUrl(item.image) ||
                            "/placeholder.svg?height=200&width=200&query=book club merchandise" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={item?.name}
                          className="max-w-full max-h-full object-contain rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 items-center justify-center w-full h-48 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30">
                        {item?.category === "bookmark" && <Bookmark className="w-12 h-12 text-emerald-500" />}
                        {item?.category === "mug" && <Coffee className="w-12 h-12 text-emerald-500" />}
                        {item?.category === "t-shirt" && <Shirt className="w-12 h-12 text-emerald-500" />}
                        <p className="text-emerald-600 dark:text-emerald-400 font-serif">No Image</p>
                      </div>
                    )}
                    <div className="mt-4 text-center">
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                        KES {item?.price?.toLocaleString()}
                      </p>
                      {item?.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-2">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-serif flex-1"
                      disabled={!item?.inStock}
                      asChild
                    >
                      <Link href={`/store/${item?._id}`}>{item?.inStock ? "View Details" : "Out of Stock"}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filter and Cart Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6" id="products">
          <div className="w-full sm:w-auto">
            <CategoryFilter merchandise={merchandise} initialCategory={categoryFilter} />
          </div>
          <CartButton />
        </div>

        {/* All Products Grid */}
        <div>
          <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-500 font-serif mb-6 text-center">
            All Products
          </h2>

          {sortedMerchandise.length === 0 && (
            <div className="border border-gray-200 dark:border-gray-700 p-12 flex flex-col gap-4 items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Image
                width={200}
                height={200}
                src={"/placeholder.svg?height=200&width=200&query=no products found"}
                alt={"no products found icon"}
              />
              <p className="text-gray-700 dark:text-gray-300 font-serif text-xl">No products found.</p>
              <p className="text-gray-500 dark:text-gray-400 font-serif">Try selecting a different category</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedMerchandise.map((item) => (
              <Card
                key={item?._id}
                className="hover:shadow-lg transition-all duration-300 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group hover:-translate-y-1"
              >
                <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="text-lg font-semibold text-emerald-800 dark:text-emerald-500 font-serif group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {item?.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400 font-serif capitalize">
                    {item?.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center pt-4">
                  {item?.image ? (
                    <div className="relative w-full h-40 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg" />
                      <Image
                        width={150}
                        height={150}
                        src={
                          convertWixImageToUrl(item.image) ||
                          "/placeholder.svg?height=150&width=150&query=book club merchandise" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={item?.name}
                        className="max-w-full max-h-full object-contain rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center justify-center w-full h-40 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30">
                      {item?.category === "bookmark" && (
                        <Bookmark className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                      )}
                      {item?.category === "mug" && (
                        <Coffee className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                      )}
                      {item?.category === "t-shirt" && (
                        <Shirt className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                      )}
                      <p className="text-emerald-600 dark:text-emerald-400 font-serif text-sm">No Image</p>
                    </div>
                  )}
                  <div className="mt-3 text-center">
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-serif">
                      KES {item?.price?.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-serif w-full"
                    disabled={!item?.inStock}
                    asChild
                  >
                    <Link href={`/store/${item?._id}`}>{item?.inStock ? "View Details" : "Out of Stock"}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="mt-16 text-center bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-700">
          <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-500 font-serif mb-4">
            Prefer to Order by Phone?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 font-serif mb-6">
            Call us directly to place your order. We're here to help you find the perfect book club merchandise!
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-serif px-8 py-3 rounded-full bg-transparent"
            asChild
          >
            <Link href="tel:+254700000000">
              <Phone className="w-5 h-5 mr-2" />
              Call +254 700 000 000
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
