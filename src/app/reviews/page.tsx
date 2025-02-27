import { Button } from "@/components/ui/button";
import { getMember, getServerClient } from "@/lib/wix";
import { convertWixImageToUrl } from "@/lib/wix-client";
import { StarIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ReviewsPage() {
  const member = await getMember();

  if (!member) {
    redirect("/"); // Redirects to the homepage if the user is not logged in.
  }

  const client = await getServerClient();
  const reviews = await client.items
    .queryDataItems({
      dataCollectionId: "Reviews",
    })
    .eq("_owner", member.id)
    .find()
    .then((res) => res.items.map((item) => item.data));

  // Fetch book data for each review
  const books = await Promise.all(
    reviews.map(async (review) => {
      const book = await client.items
        .getDataItem(review?.bookId, { dataCollectionId: "Books" })
        .then((res) => res.data);
      return { review, book };
    })
  );

  return (
    <div className="max-w-screen-lg mx-auto py-12 px-4 lg:px-8 space-y-12 dark:bg-gray-900 dark:text-white">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
        Your <span className="text-green-600">Reviews & ⭐⭐⭐</span>
      </h1>

      {/* No Reviews Fallback */}
      {reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 border border-green-600 p-8 rounded-lg bg-white/70 dark:bg-gray-800/70 shadow-lg backdrop-blur-md">
          <Image
            width={200}
            height={200}
            src="/not-found.svg"
            alt="No reviews icon"
            className="opacity-80"
          />
          <p className="text-lg font-medium text-green-700 dark:text-green-400">
            You have not reviewed any books yet.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        {books.map(({ review, book }) => (
          <div
            key={review?._id}
            className="p-6 border border-green-700 rounded-lg bg-white/70 dark:bg-gray-800/70 shadow-lg backdrop-blur-md hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              {/* Reviewer */}
              <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                {review?.name}
              </p>

              {/* Star Rating */}
              <div className="flex">
                {[...Array(Math.floor(review?.rating))].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
                {review?.rating % 1 !== 0 && (
                  <StarIcon
                    key="half"
                    className="w-5 h-5 text-yellow-400 fill-yellow-400 opacity-50"
                  />
                )}
              </div>
            </div>

            {/* Book Section */}
            <div className="flex items-center gap-6">
              {/* Book Image */}
              {book?.image ? (
                <Image
                  width={100}
                  height={100}
                  src={convertWixImageToUrl(book?.image)}
                  alt={book?.title}
                  className="w-[100px] h-[100px] rounded-lg object-cover shadow-md border border-green-700 transition-transform hover:scale-105"
                />
              ) : (
                <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border border-green-700">
                  <p className="text-gray-600 dark:text-gray-300">No Image</p>
                </div>
              )}

              {/* Review Content */}
              <p className="text-gray-700 dark:text-gray-300 font-serif">
                {review?.review}
              </p>
            </div>

            {/* Delete Button */}
            <div className="mt-4 flex justify-end">
              <form
                action={async () => {
                  "use server";
                  const client = await getServerClient();
                  await client.items.removeDataItem(review?._id, {
                    dataCollectionId: "Reviews",
                  });
                  revalidatePath("/reviews");
                }}
              >
                <Button
                  variant="destructive"
                  size="sm"
                  type="submit"
                  className="transition-transform hover:scale-105"
                >
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
