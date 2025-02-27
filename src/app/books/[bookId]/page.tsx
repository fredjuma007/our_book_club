import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { BookIcon, ChevronLeft, StarIcon } from "lucide-react";
import { PostReviewForm } from "./post-review-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerClient, getMember } from "@/lib/wix";
import { convertWixImageToUrl } from "@/lib/wix-client";
import { notFound } from "next/navigation";
import { loginAction } from "@/app/actions";
import type { Metadata } from "next";

interface Review {
  _id: string;
  name: string;
  rating: number;
  review: string;
  bookId: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  publisher?: string;
  description?: string;
  image?: any;
}

interface PageProps {
  params: { bookId: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Book Details - ${params.bookId}`,
  };
}

export default async function Page({ params }: PageProps) {
  const [client, member] = await Promise.all([getServerClient(), getMember()]);
  const isLoggedIn = await client.auth.loggedIn();

  try {
    const [bookResponse, reviewsResponse] = await Promise.all([
      client.items.getDataItem(params.bookId, {
        dataCollectionId: "Books",
      }),
      client.items.queryDataItems({
        dataCollectionId: "Reviews",
      }).eq("bookId", params.bookId).find(),
    ]);

    const book = bookResponse.data as Book;
    const reviews = reviewsResponse.items.map((item) => item.data as Review);

    if (!book) {
      notFound();
    }

    return (
      <div className="relative max-w-screen-lg mx-auto py-12 px-4 lg:px-8 space-y-12 dark:text-white">
        {/* Background Image */}
        {book.image && (
          <div className="absolute inset-0 w-full h-full -z-10">
            <div className="relative w-full h-full opacity-30">
              <Image
                src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                alt={book.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        <div>
          <Button variant="link" asChild className="text-green-800 dark:text-green-500 hover:underline">
            <Link href="/books">
              <ChevronLeft className="mr-1" /> Back to books
            </Link>
          </Button>
        </div>

        <Card className="relative rounded-lg shadow-lg bg-white/80 dark:bg-gray-800/80 border border-green-700 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-500 font-serif">{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-8">
              {book.image ? (
                <Image
                  width={200}
                  height={300}
                  src={convertWixImageToUrl(book.image) || "/placeholder.svg"}
                  alt={book.title}
                  className="w-[200px] h-[300px] rounded-lg object-cover shadow-md border border-green-700"
                />
              ) : (
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-[200px] h-[300px] rounded-lg bg-gray-100 dark:bg-gray-700 border border-green-700">
                  <BookIcon className="w-10 h-10 text-gray-600 dark:text-gray-300" />
                  <p className="text-gray-600 dark:text-gray-300">No Image</p>
                </div>
              )}
              <div className="flex flex-col justify-between">
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">By {book.author}</p>
                {book.publisher && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recommended by {book.publisher}</p>
                )}
                <p className="mt-4 text-gray-700 dark:text-gray-300 font-serif">
                  {book.description || "No description available for this book."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative rounded-lg shadow-md bg-white/80 dark:bg-gray-800/80 border border-green-700 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif">
              ⭐ Rate & Post a Review ⭐
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-8">
              {isLoggedIn && member ? (
                <PostReviewForm bookId={book._id} userName={member.nickname || member.loginEmail || "Anonymous"} />
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 font-serif">Please log in to post a review</p>
                  <form action={loginAction}>
                    <Button variant="outline" className="bg-green-700 text-white hover:bg-green-800 font-serif">
                      Login to Review
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="relative rounded-lg shadow-md bg-white/80 dark:bg-gray-800/80 border border-green-700 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 last:border-none">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-green-700 dark:text-green-400">{review.name}</p>
                      <div className="flex items-center">
                        {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                          <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                        {review.rating % 1 !== 0 && <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400 opacity-50" />}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300 font-serif">{review.review}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 font-serif">No reviews available. Be the first to review this book!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error fetching book data:", error);
    notFound();
  }
}
