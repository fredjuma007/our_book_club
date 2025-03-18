"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-green-200 dark:border-green-800">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex justify-between items-center">
        <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
          © {new Date().getFullYear()} The Reading Circle
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
          <span className="whitespace-nowrap">Developed by</span>
          <Link
            href="https://jumaportfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 hover:underline ml-1 whitespace-nowrap"
          >
            Fred Juma
          </Link>
        </p>
      </div>
    </footer>
  )
}
