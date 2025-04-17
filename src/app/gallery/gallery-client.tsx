"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  X,
  ImageIcon,
  Sparkles,
  BookMarked,
  BookOpen,
  CalendarCheck,
} from "lucide-react"
import { ScrollToTop } from "@/components/scroll-to-top"
import Footer from "@/components/footer"

export interface GalleryItem {
  id: string
  title: string
  caption: string
  src: string
  isVideo?: boolean
  videoUrl?: string
  date?: string
  category?: string
}

export default function GalleryClient({ galleryItems }: { galleryItems: GalleryItem[] }) {
  // Only filter for images
  const images = galleryItems?.filter((item) => !item.isVideo) || []
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Optimized Click Handler
  const openImage = useCallback((index: number) => {
    setSelectedImageIndex(index)
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 selection:bg-green-700/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#15803d_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,#22c55e_1px,transparent_0)] bg-[length:40px_40px] opacity-20" />

        <div className="max-w-screen-xl mx-auto py-16 px-4 lg:px-8 relative">
          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute right-10 top-10 hidden lg:block animate-float"
          >
            <Camera className="w-16 h-16 text-green-700/30 transform rotate-12" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-20 bottom-10 hidden lg:block animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <BookMarked className="w-12 h-12 text-green-700/20 transform -rotate-12" />
          </motion.div>

          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 relative inline-block group">
              <span className="absolute -inset-1 bg-green-700/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              Gallery 📸
              <Sparkles className="absolute -right-8 -top-8 w-6 h-6 text-green-700/40 animate-spin-slow" />
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-serif max-w-2xl mx-auto">
              Capturing moments and memories from our book club journey
            </p>
          </motion.div>

          {/* Navigation Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-200 font-serif group relative overflow-hidden"
            >
              <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/club-events">
                <CalendarCheck className="w-4 h-4 mr-2" /> <span>Events</span>
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
      </div>

      {/* Main Content - Only Images Section */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >

          {images.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <motion.div
                  layout
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div
                    className="relative bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-float"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative aspect-[4/3] cursor-pointer group" onClick={() => openImage(index)}>
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.caption}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <p className="text-white text-sm px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          Click to view
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-green-800 dark:text-green-500 font-serif mb-1">{image.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-serif line-clamp-2">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700">
              <ImageIcon className="w-16 h-16 mx-auto text-green-700/50 mb-4" />
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-2">
                No Images Available
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-serif">Check back soon for images from our events!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-green-700/80 hover:bg-green-700 text-white p-2 rounded-full transition-colors duration-200 group shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 transition-transform duration-200 group-hover:-translate-x-1" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-green-700/80 hover:bg-green-700 text-white p-2 rounded-full transition-colors duration-200 group shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Image Container */}
              <div className="relative">
                <Image
                  src={images[selectedImageIndex].src || "/placeholder.svg"}
                  alt={images[selectedImageIndex].caption}
                  width={900}
                  height={600}
                  className="max-w-full max-h-[80vh] rounded-lg border-2 border-green-700 shadow-lg mx-auto object-contain bg-black/50"
                />

                {/* Close Button */}
                <Button
                  variant="outline"
                  onClick={() => setSelectedImageIndex(null)}
                  className="absolute top-4 right-4 border-white hover:bg-white/20 
                  hover:text-white group rounded-full shadow-childish"
                >
                  <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                </Button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-green-700/80 text-white px-3 py-1 rounded-full backdrop-blur-sm shadow-lg">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Caption */}
              <div className="mt-4 p-4 bg-[#fffaf0] dark:bg-gray-800 rounded-lg border border-green-700 backdrop-blur-sm shadow-lg">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif text-center mb-2">
                  {images[selectedImageIndex].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-serif text-center">
                  {images[selectedImageIndex].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTop />
      <Footer />
    </div>
  )
}
