import { Button } from "@/components/ui/button";
import client from "@/lib/wix";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Link from "next/link";
  

export default async function Home() {

    const books = await client.items.queryDataItems({
        dataCollectionId: "Books",
    })
    .find()
    .then((res) => res.items.map((item) => item.data));

    console.log(books);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl font-bold">Books</h1>

        <div className="grid grid-cols-3 gap-4">
            {books.map((book) => (
                <Card key={book?._id}>
                <CardHeader>
                  <CardTitle>{book?.title}</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{book?.author}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={`/books/${book?._id}`}>Read Reviews</Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
        </div>

        <Button>Add Book</Button>
    </div>
  );
}
