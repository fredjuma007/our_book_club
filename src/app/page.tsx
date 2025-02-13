import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="pt-24 flex justify-center flex-grow p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="text-center max-w-3xl">
          <Image
            src="/logo.jpeg"
            alt="reading circle logo"
            width={200}
            height={200}
            className="mx-auto mb-8 rounded-full border-4 border-red-300 dark:border-red-500 shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-6 animate__animated animate__fadeIn animate__delay-1s"
          />
          <h1 className="text-4xl font-bold mb-4">
            WELCOME TO <span className="text-red-500 dark:text-red-400">THE READING CIRCLE</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Discover, share, and review your <span className="text-red-500 dark:text-red-400"> favorite books</span> with a community of
            <span className="text-red-500 dark:text-red-400"> book lovers</span>.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              asChild
              size="lg"
              className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-1"
            >
              <Link href="/books">Explore Books</Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-1"
            >
              <Link href="/club-events">Events</Link>
            </Button>
          </div>
        </div>
      </div>
      <footer className="bg-red-600 dark:bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Reading Circle</p>
        <p className="text-sm">
          Developed By
          {" "}
          <Link href="https://jumaportfolio.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:underline text-white dark:text-red-400">
            Fred Juma
          </Link>
        </p>
      </footer>
    </div>
  );
}
