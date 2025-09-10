"use client"

import Link from "next/link"
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-green-200 dark:border-green-800">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex justify-between items-center">
        <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
          © {new Date().getFullYear()} TRC254
        </p>
        <div className="flex items-center space-x-4">
          {/* Social media icons in the middle */}
          <Link
            href="https://www.instagram.com/thereadingcircle254/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-600"
            aria-label="Instagram"
          >
            <FaInstagram size={18} />
          </Link>
          <Link
            href="https://www.tiktok.com/@thereadingcircle254"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-black"
            aria-label="TikTok"
          >
            <FaTiktok size={18} />
          </Link>
          <Link
            href="https://www.youtube.com/@TheReadingCircle254"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-red-600"
            aria-label="YouTube"
          >
            <FaYoutube size={18} />
          </Link>
          {/* Developed by */}
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
      </div>
    </footer>
  )
}
