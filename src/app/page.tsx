import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[url('/picnic.jpg')] bg-cover bg-center bg-no-repeat text-green-600 dark:text-green-500">
      {/* Overlay for better readability in both light and dark themes */}
      <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-black dark:bg-opacity-80"></div>

      <div className="relative pt-16 flex justify-center flex-grow p-6 font-serif">
        <div className="text-center max-w-3xl bg-white dark:bg-opacity-10 dark:backdrop-blur-md p-6 rounded-lg shadow-lg border border-green-600">
          <Image
            src="/logo.jpeg"
            alt="Reading Circle Logo"
            width={200}
            height={200}
            className="mx-auto mb-4 rounded-full border-4 border-green-500 shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110"
          />
          <h1 className="text-4xl font-bold mb-3 text-green-600 dark:text-white">
            WELCOME TO <span className="text-green-500">THE READING CIRCLE</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 italic">
            "A reader lives a thousand lives before he dies..." – George R.R. Martin
          </p>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            Discover, share, and review your <span className="text-green-500">favorite books</span> with a
            community of <span className="text-green-500">book lovers</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-1"
            >
              <Link href="/books">Explore Books 📚</Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-1"
            >
              <Link href="/club-events">Events 👯‍♂️</Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-1"
            >
              <Link href="/gallery">Gallery 📸</Link>
            </Button>
          </div>
        </div>
      </div>

      <footer className="bg-gray-100 dark:bg-gray-900 text-green-600 dark:text-white py-4 text-center relative z-10 border-t border-green-600">
        <p className="text-sm">&copy; {new Date().getFullYear()} Reading Circle</p>
        <p className="text-sm">
          Developed By{" "}
          <Link
            href="https://jumaportfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-green-500"
          >
            Fred Juma
          </Link>
        </p>
      </footer>
    </div>
  );
}
