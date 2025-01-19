import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { BookIcon, ChevronLeft, StarIcon } from "lucide-react";
import { PostReviewForm } from "./post-review-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerClient } from "@/lib/wix";
import { convertWixImageToUrl } from "@/lib/wix-client";

export default async function BookPage({
  params,
}: {
  params: { bookId: string };
}) {
  const { data: book } = await getServerClient().items.getDataItem(
    params.bookId,
    {
      dataCollectionId: "Books",
    }
  );

  const reviews = await getServerClient()
    .items.queryDataItems({
      dataCollectionId: "Reviews",
    })
    .eq("bookId", params.bookId)
    .find()
    .then((res) => res.items.map((item) => item.data));

  return (
    <div className="max-w-screen-lg mx-auto py-12 px-4 lg:px-8 space-y-12 dark:bg-gray-900 dark:text-white">
      {/* Back Button */}
      <div>
        <Button
          variant="link"
          asChild
          className="text-green-600 dark:text-green-500 hover:underline"
        >
          <Link href="/books">
            <ChevronLeft className="mr-1" /> Back to books
          </Link>
        </Button>
      </div>

      {/* Book Details */}
      <Card className="rounded-lg shadow-md bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-500">
            {book?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            {book?.image ? (
              <Image
                width={200}
                height={300}
                src={convertWixImageToUrl(book?.image)}
                alt={book?.title}
                className="w-[200px] h-[300px] rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-[200px] h-[300px] rounded-lg bg-gray-200 dark:bg-gray-700">
                <BookIcon className="w-10 h-10 text-gray-500 dark:text-gray-300" />
                <p className="text-gray-500 dark:text-gray-300">No Image</p>
              </div>
            )}
            <div className="flex flex-col justify-between">
              <p className="text-lg font-semibold">By {book?.author}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recommended by {book?.publisher}
              </p>
              {/*<p className="text-lg font-semibold">Recommended by {book?.publisher}</p>*/}
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {book?.description || "No description available for this book."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="rounded-lg shadow-md bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-500">
            Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review?._id} className="border-b pb-4 last:border-none">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{review?.name}</p>
                    <div className="flex">
                      {[...Array(review?.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {review?.review}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No reviews available. Be the first to review this book!
              </p>
            )}
          </div>

          {/* Review Form */}
          <div className="mt-8">
            <PostReviewForm bookId={book?._id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
