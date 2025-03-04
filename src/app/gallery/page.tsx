"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Camera, X, ImageIcon, Sparkles, Grid2x2, Grid3x3 } from "lucide-react"

export default function GalleryPage() {
  const [layout, setLayout] = useState<"grid" | "masonry">("grid")
  const images = [
    { src: "/gallery/sinners.jpg", caption: "First Physical Meeting under name Reading Circle (sinners club)" },
    { src: "/gallery/sinners (1).jpg", caption: "First Physical Meeting under name Reading Circle (sinners club)" },
    { src: "/gallery/pathway.jpg", caption: "Open day. Hey we had a booth" },
    {
      src: "/gallery/tommorow(3).jpg",
      caption: "November 2024 BOM review, collaboration with Lit Nomads, former Sparkle",
    },
    { src: "/gallery/paint n sip.jpg", caption: "Painting session with Lit Nomads" },
    { src: "/gallery/paint n sip (1).jpg", caption: "Painting session with Lit Nomads" },
    { src: "/gallery/Discussion.jpg", caption: "Moderators During A book Review" },
    { src: "/gallery/picnic.jpg", caption: "A beautiful day at the picnic" },
    { src: "/gallery/picnic notes.jpg", caption: "A beautiful day at the picnic" },
    { src: "/gallery/bottles.jpg", caption: "Enjoying the great outdoors" },
    { src: "/gallery/picnic bottles.jpg", caption: "Group fun and laughter" },
  ]

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
            className="absolute right-10 top-10 hidden lg:block animate-[bounce_6s_ease-in-out_infinite]"
          >
            <Camera className="w-16 h-16 text-green-700/30 transform rotate-12" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-20 bottom-10 hidden lg:block animate-[bounce_8s_ease-in-out_infinite]"
          >
            <ImageIcon className="w-12 h-12 text-green-700/20 transform -rotate-12" />
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

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-2 mt-8"
          >
            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif relative overflow-hidden group"
            >
              <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/books">
                📚 <span>Books</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-200 hover:text-white font-serif relative overflow-hidden group"
            >
              <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/club-events">
              📅 <span>Events</span>
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#fffaf0] dark:bg-gray-800 transform -skew-y-2" />
      </div>

      {/* Floating Layout Controls */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
      >
        <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-2xl shadow-lg border border-green-700 p-2 backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            <Button
              variant={layout === "grid" ? "default" : "outline"}
              onClick={() => setLayout("grid")}
              className={`${
                layout === "grid" ? "bg-green-700 text-white" : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative group px-3 py-6`}
              title="Grid Layout"
            >
              <Grid2x2 className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute right-0 translate-x-full pl-2 bg-green-700 text-white text-sm py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Grid Layout
              </span>
            </Button>
            <Button
              variant={layout === "masonry" ? "default" : "outline"}
              onClick={() => setLayout("masonry")}
              className={`${
                layout === "masonry" ? "bg-green-700 text-white" : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative group px-3 py-6`}
              title="Masonry Layout"
            >
              <Grid3x3 className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute right-0 translate-x-full pl-2 bg-green-700 text-white text-sm py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Masonry Layout
              </span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Layout Controls */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-full shadow-lg border border-green-700 p-2 backdrop-blur-sm">
          <div className="flex gap-2">
            <Button
              variant={layout === "grid" ? "default" : "outline"}
              onClick={() => setLayout("grid")}
              className={`${
                layout === "grid" ? "bg-green-700 text-white" : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif rounded-full`}
              title="Grid Layout"
            >
              <Grid2x2 className="w-4 h-4" />
            </Button>
            <Button
              variant={layout === "masonry" ? "default" : "outline"}
              onClick={() => setLayout("masonry")}
              className={`${
                layout === "masonry" ? "bg-green-700 text-white" : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif rounded-full`}
              title="Masonry Layout"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Gallery Grid */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16">
        <motion.div
          layout
          className={`${
            layout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
          }`}
        >
          {images.map((image, index) => (
            <motion.div
              layout
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${layout === "grid" ? "" : "break-inside-avoid"} group`}
            >
              <div className="relative bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative aspect-[4/3] cursor-pointer group" onClick={() => openImage(index)}>
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-sm font-serif px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Click to view
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-serif line-clamp-2">{image.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
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
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-green-700/80 hover:bg-green-800 text-white p-2 rounded-full transition-colors duration-200 group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 transition-transform duration-200 group-hover:-translate-x-1" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-green-700/80 hover:bg-green-800 text-white p-2 rounded-full transition-colors duration-200 group"
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
                  className="max-w-full max-h-[80vh] rounded-lg border-4 border-green-700 shadow-lg mx-auto object-contain bg-black/50"
                />

                {/* Close Button */}
                <Button
                  variant="outline"
                  onClick={() => setSelectedImageIndex(null)}
                  className="absolute top-4 right-4 border-primary hover:bg-primary 
                  hover:text-primary-foreground group dark:border-primary dark:hover:bg-primary 
                  dark:hover:text-primary-foreground">
                  <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" 
                  />
                </Button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 bg-green-700/80 text-white px-3 py-1 rounded-full font-serif backdrop-blur-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Caption */}
              <div className="mt-4 p-4 bg-[#f5f0e1] dark:bg-gray-800 rounded-lg border border-green-700 backdrop-blur-sm">
                <p className="text-green-800 dark:text-green-500 text-lg font-serif text-center">
                  {images[selectedImageIndex].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

