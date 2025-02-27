import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { BookIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation"
import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const client = await getServerClient()

  const books = await client.items
    .queryDataItems({
      dataCollectionId: "Books",
    })
    .startsWith("title", searchParams.search ?? "")
    .find()
    .then((res) => res.items.map((item) => item.data))
    .catch((error) => {
      console.error("Error fetching books:", error)
      return []
    })

  return (
    <div className="max-w-screen-xl mx-auto py-12 space-y-8 px-4 lg:px-8 dark:bg-gray-900 dark:text-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-500">Books 📚</h1>
        <form
          action={async (formData) => {
            "use server"
            const search = formData.get("search")
            redirect(`/books?search=${search}`)
          }}
          className="flex gap-2"
        >
          <Input name="search" type="text" placeholder="Search books" className="dark:bg-gray-800 dark:text-white" />
          <Button
            variant="secondary"
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            Search 🔍
          </Button>
        </form>

        <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-200 hover:text-white">
          <Link className="text-green-600 dark:text-white" href="/club-events">
            <span className="text-green-600">👯‍♂️ Events</span>
          </Link>
        </Button>

        <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-200 hover:text-white">
          <Link className="text-green-600 dark:text-white" href="/gallery">
            📸 <span className="text-green-600">Gallery</span>
          </Link>
        </Button>
      </div>

      {/* No Books Found */}
      {books.length === 0 && (
        <div className="border p-12 flex flex-col gap-4 items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Image width={200} height={200} src={"/not-found.svg"} alt={"book not found icon"} />
          <p className="text-gray-700 dark:text-gray-300">No books found.</p>
          <p className="text-gray-500 dark:text-gray-400">Confirm the spelling of the book and try again</p>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <Card
            key={book?._id}
            className="hover:shadow-lg transition-shadow duration-300 rounded-lg bg-white dark:bg-gray-800"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-600 dark:text-green-500">{book?.title}</CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                {book?.author || "Unknown Author"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Link href={`/books/${book?._id}`} className="w-full">
                {book?.image ? (
                  <Image
                    width={150}
                    height={200}
                    src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                    alt={book?.title}
                    className="w-full h-48 object-cover mb-4 rounded-lg hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="flex flex-col gap-2 items-center justify-center w-[150px] h-[200px] mb-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-opacity">
                    <BookIcon className="w-10 h-10 text-gray-500 dark:text-gray-300" />
                    <p className="text-gray-500 dark:text-gray-300">No Image</p>
                  </div>
                )}
              </Link>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                asChild
                variant="secondary"
                className="bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                <Link href={`/books/${book?._id}`}>Read Reviews</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
