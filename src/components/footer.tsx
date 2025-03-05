"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-green-200 dark:border-green-800">
      <div className="max-w-7xl mx-auto px-2 py-1 md:px-4 md:py-2 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} The Reading Circle
        </p>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
          Developed by {" "}
          <Link
            href="https://jumaportfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 hover:underline"
          >
            Fred Juma
          </Link>
        </p>
      </div>
    </footer>
  );
}
