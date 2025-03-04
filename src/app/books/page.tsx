import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { BookIcon, BookOpen, BookMarked, Calendar, Camera, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation"
import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { ScrollToTop } from "@/components/scroll-to-top"

export default async function Home({ searchParams }: { searchParams: { search?: string } }) {
  const client = await getServerClient()

  const books = await client.items
    .queryDataItems({ dataCollectionId: "Books" })
    .find()
    .then((res) => res.items.map((item) => item.data))
    .catch((error) => {
      console.error("Error fetching books:", error)
      return []
    })

  const searchQuery = searchParams.search || ""
  const filteredBooks = searchQuery
    ? books.filter(
        (book) =>
          book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book?.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book?.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book?.recommender?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          <div className="absolute right-10 top-10 hidden lg:block animate-[bounce_6s_ease-in-out_infinite]">
            <BookOpen className="w-16 h-16 text-green-700/30 transform rotate-12" />
          </div>
          <div className="absolute left-20 bottom-10 hidden lg:block animate-[bounce_8s_ease-in-out_infinite]">
            <BookMarked className="w-12 h-12 text-green-700/20 transform -rotate-12" />
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 relative inline-block group">
              <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              All Books 📚
              <Sparkles className="absolute -right-8 -top-8 w-6 h-6 text-green-700/40" />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Explore the books we have read and currently reading. 
              Drop a review and share your ratings with the community!
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b-4 border-green-700 pb-6 mb-8">
          <form
            action={async (formData) => {
              "use server"
              const search = formData.get("search")
              redirect(`/books?search=${search}`)
            }}
            className="flex gap-2 w-full sm:w-auto"
          >
            <Input
              name="search"
              type="text"
              placeholder="Enter Title, Author or Genre"
              defaultValue={searchQuery}
              className="dark:bg-gray-800 dark:text-white border-2 border-green-700"
            />
            <Button
              variant="secondary"
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white transition-colors font-serif"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
          <div className="flex gap-2">
            <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white">
              <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/club-events">
                <Calendar className="w-4 h-4 mr-1" /> <span>Events</span>
              </Link>
            </Button>

            <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white">
              <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/gallery">
                <Camera className="w-4 h-4 mr-1" /> <span>Gallery</span>
              </Link>
            </Button>
          </div>
        </div>

        {filteredBooks.length === 0 && (
          <div className="border p-12 flex flex-col gap-4 items-center justify-center bg-[#fffaf0] dark:bg-gray-800 rounded-lg shadow-md">
            <Image width={200} height={200} src={"/not-found.svg"} alt={"book not found icon"} />
            <p className="text-gray-700 dark:text-gray-300 font-serif text-xl">No books found.</p>
            <p className="text-gray-500 dark:text-gray-400 font-serif">
              Confirm the spelling of the book or author and try again
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book?._id}
              className="hover:shadow-lg transition-all duration-300 rounded-lg bg-[#fffaf0] dark:bg-gray-800 border border-green-700 group hover:-translate-y-1"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-500 font-serif group-hover:text-green-700">
                  {book?.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 font-serif">
                  {book?.author || "Unknown Author"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-2">
                {book?.image ? (
                  <Link
                    href={`/books/${book?._id}`}
                    className="relative w-full h-64 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg" />
                    <Image
                      width={150}
                      height={200}
                      src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                      alt={book?.title}
                      className="max-w-full max-h-full object-contain rounded-lg cursor-pointer border border-green-700 transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2 items-center justify-center w-[150px] h-[200px] rounded-lg bg-[#eae2d0] dark:bg-gray-700 border border-green-700 group-hover:bg-[#e5dcc5]">
                    <BookIcon className="w-10 h-10 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                    <p className="text-gray-600 dark:text-gray-300 font-serif">No Image</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button
                  asChild
                  variant="secondary"
                  className="bg-green-700 hover:bg-green-800 text-white transition-colors font-serif w-full"
                >
                  <Link href={`/books/${book?._id}`}>Read Reviews</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          <ScrollToTop />
        </div>
      </div>
    </div>
  )
}

