import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { BookIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/wix";
import { convertWixImageToUrl } from "@/lib/wix-client";

export default async function Home({ searchParams }: { searchParams: { search?: string } }) {
  const client = await getServerClient();

  const books = await client.items
    .queryDataItems({ dataCollectionId: "Books" })
    .find()
    .then((res) => res.items.map((item) => item.data))
    .catch((error) => {
      console.error("Error fetching books:", error);
      return [];
    });

  const searchQuery = searchParams.search || "";
  const filteredBooks = searchQuery
    ? books.filter(
        (book) =>
          book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book?.author?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;

  return (
    <div className="max-w-screen-xl mx-auto py-12 space-y-8 px-4 lg:px-8 bg-[#f5f0e1] dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b-4 border-green-700 pb-6">
        <h1 className="text-4xl font-bold text-green-800 dark:text-green-500 font-serif">📚 The Book Nook</h1>
        <form
          action={async (formData) => {
            "use server";
            const search = formData.get("search");
            redirect(`/books?search=${search}`);
          }}
          className="flex gap-2"
        >
          <Input name="search" type="text" placeholder="Search by title or author" className="dark:bg-gray-800 dark:text-white border-2 border-green-700" />
          <Button variant="secondary" type="submit" className="bg-green-700 hover:bg-green-800 text-white transition-colors font-serif">
            Search 🔍
          </Button>
        </form>
        <div className="flex gap-2">
          <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white">
            <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/club-events">
              👯‍♂️ <span>Events</span>
            </Link>
          </Button>

          <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white">
            <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/gallery">
              📸 <span>Gallery</span>
            </Link>
          </Button>
        </div>
      </div>

      {filteredBooks.length === 0 && (
        <div className="border p-12 flex flex-col gap-4 items-center justify-center bg-[#eae2d0] dark:bg-gray-800 rounded-lg shadow-md">
          <Image width={200} height={200} src={"/not-found.svg"} alt={"book not found icon"} />
          <p className="text-gray-700 dark:text-gray-300 font-serif">No books found.</p>
          <p className="text-gray-500 dark:text-gray-400 font-serif">Confirm the spelling of the book or author and try again</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book?._id} className="hover:shadow-lg transition-shadow duration-300 rounded-lg bg-[#fffaf0] dark:bg-gray-800 border border-green-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-500 font-serif">{book?.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 font-serif">{book?.author || "Unknown Author"}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {book?.image ? (
                <Link href={`/books/${book?._id}`}>
                  <Image
                    width={150}
                    height={200}
                    src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                    alt={book?.title}
                    className="w-full h-48 object-cover mb-4 rounded-lg cursor-pointer border border-green-700"
                  />
                </Link>
              ) : (
                <div className="flex flex-col gap-2 items-center justify-center w-[150px] h-[200px] mb-4 rounded-lg bg-[#eae2d0] dark:bg-gray-700 border border-green-700">
                  <BookIcon className="w-10 h-10 text-gray-600 dark:text-gray-300" />
                  <p className="text-gray-600 dark:text-gray-300">No Image</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild variant="secondary" className="bg-green-700 hover:bg-green-800 text-white transition-colors font-serif">
                <Link href={`/books/${book?._id}`}>Read Reviews</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
