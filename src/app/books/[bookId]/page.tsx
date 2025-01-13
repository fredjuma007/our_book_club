import client from "@/lib/wix";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image";
import { convertWixImageToUrl } from "@/lib/wix";
import { BookIcon } from "lucide-react";

export default async function BookPage({
    params,
}: {
    params: { bookId: string };
}) {
    const { data: book} = await client.items.getDataItem(params.bookId, {
        dataCollectionId: "Books",
    });

  return (
    <div className="container mx-auto p-8">
       <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{book?.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex gap-4">
                {book?.image ? (
            <Image
                width={400}
                height={300} 
                src={convertWixImageToUrl(book?.image)} 
                alt={book?.title}
                className="w-[400px] h-[300px] mb-4 rounded-lg"
            />
        ) : ( <div className="flex flex-col gap-2 items-center justify-center w-[400px] h-[300px] mb-4 bg-gray-200 rounded-lg">
            <BookIcon className="w-12 h-12 text-gray-400" />
            <p className="text-black">No Image</p>
            </div>
            )}
            <div>
            <p className="text-lg font-semibold">By {book?.author}</p>
            <p className="text-sm text-gray-500">
                Reviewed on{book?.reviewDate}
                </p>
            <p className="mt-4">{book?.description}</p>
            </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
