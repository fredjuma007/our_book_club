import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 flex justify-center flex-grow p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="text-center max-w-3xl">
          <Image
            src="/logo.jpeg"
            alt="reading circle logo"
            width={200}
            height={200}
            className="mx-auto mb-8 rounded-full border-4 border-gray-300 shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-6 animate__animated animate__fadeIn animate__delay-1s"
          />
          <h1 className="text-4xl font-bold mb-4">WELCOME TO READING CIRCLE</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover, share, and review your favorite books with a community of
            book lovers.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-1"
          >
            <Link href="/books">Explore Books</Link>
          </Button>
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Reading Circle
        </p>
        <p className="text-sm">
            Developed By
          {" "}
            <Link href="https://jumaportfolio.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:underline text-green-600 dark:text-green-500">
            Fred Juma
            </Link>
        </p>
      </footer>
    </div>
  );
}
