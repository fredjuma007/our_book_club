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
  CalendarCheck,
  Video,
  Play,
} from "lucide-react"
import { ScrollToTop } from "@/components/scroll-to-top"
import MuxPlayer from "@mux/mux-player-react"

export interface GalleryItem {
  id: string
  title: string
  caption: string
  src: string
  isVideo?: boolean
  videoUrl?: string
  date?: string // Always a string now
  category?: string
}

type TabType = "images" | "videos"

export default function GalleryClient({ galleryItems }: { galleryItems: GalleryItem[] }) {
  const [activeTab, setActiveTab] = useState<TabType>("images")
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Filter items based on type
  const images = galleryItems?.filter((item) => !item.isVideo) || []
  const videos = galleryItems?.filter((item) => item.isVideo && item.videoUrl) || []

  const currentItems = activeTab === "images" ? images : videos

  // Optimized Click Handler
  const openImage = useCallback((index: number) => {
    setSelectedImageIndex(index)
  }, [])

  // Extract playback ID from MUX URL or return the ID directly
  const getPlaybackId = (videoUrl: string) => {
    if (!videoUrl) return ""

    // If it's already just the playback ID (alphanumeric string)
    if (/^[a-zA-Z0-9]+$/.test(videoUrl.trim())) {
      return videoUrl.trim()
    }

    // Handle MUX streaming URLs
    if (videoUrl.includes("stream.mux.com")) {
      // Format: https://stream.mux.com/PLAYBACK_ID.m3u8
      const match = videoUrl.match(/stream\.mux\.com\/([a-zA-Z0-9]+)/)
      return match ? match[1] : ""
    }

    // Handle other MUX URL formats
    if (videoUrl.includes("mux.com")) {
      const match = videoUrl.match(/([a-zA-Z0-9]{20,})/)
      return match ? match[1] : ""
    }

    // Extract from any URL that contains the playback ID
    const match = videoUrl.match(/([a-zA-Z0-9]{20,})/)
    return match ? match[1] : videoUrl
  }

  // Generate MUX thumbnail URL
  const getMuxThumbnail = (playbackId: string) => {
    if (!playbackId) return null
    // MUX provides automatic thumbnails at different time points
    return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=1`
  }

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

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <button
              onClick={() => setActiveTab("images")}
              className={`${
                activeTab === "images"
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Images ({images.length})
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`${
                activeTab === "videos"
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <Video className="w-4 h-4 mr-2" />
              Videos ({videos.length})
            </button>
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

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {currentItems.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
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
                      {activeTab === "images" ? (
                        <>
                          <Image
                            src={item.src || "/placeholder.svg"}
                            alt={item.caption}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <p className="text-white text-sm px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              Click to view
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Video thumbnail with MUX thumbnail */}
                          <div className="w-full h-full relative">
                            {(() => {
                              const playbackId = getPlaybackId(item.videoUrl || "")
                              const thumbnailUrl = getMuxThumbnail(playbackId)

                              return thumbnailUrl ? (
                                <div className="w-full h-full relative">
                                  {/* Use regular img tag to avoid Next.js domain restrictions */}
                                  <img
                                    src={thumbnailUrl || "/placeholder.svg"}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-t-xl"
                                    onError={(e) => {
                                      // Fallback to gradient background if thumbnail fails
                                      const target = e.target as HTMLImageElement
                                      target.style.display = "none"
                                      const parent = target.parentElement
                                      if (parent) {
                                        parent.innerHTML = `
                                          <div class="w-full h-full bg-gradient-to-br from-green-700/20 to-green-900/40 flex items-center justify-center rounded-t-xl">
                                            <svg class="w-16 h-16 text-green-700/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                            </svg>
                                          </div>
                                        `
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-700/20 to-green-900/40 flex items-center justify-center rounded-t-xl">
                                  <Video className="w-16 h-16 text-green-700/60" />
                                </div>
                              )
                            })()}

                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/60 rounded-full p-4 transition-all duration-300 group-hover:bg-black/80 group-hover:scale-110">
                                <Play className="w-8 h-8 text-white fill-white" />
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <p className="text-white text-sm px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              Click to play
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-green-800 dark:text-green-500 font-serif mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-serif line-clamp-2">{item.caption}</p>
                      {item.date && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-serif mt-2">{item.date}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700">
              {activeTab === "images" ? (
                <ImageIcon className="w-16 h-16 mx-auto text-green-700/50 mb-4" />
              ) : (
                <Video className="w-16 h-16 mx-auto text-green-700/50 mb-4" />
              )}
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-2">
                No {activeTab === "images" ? "Images" : "Videos"} Available
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
                Check back soon for {activeTab === "images" ? "images" : "videos"} from our events!
              </p>
            </div>
          )}
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
              className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : currentItems.length - 1)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-green-700/80 hover:bg-green-700 text-white p-2 rounded-full transition-colors duration-200 group shadow-lg"
                aria-label="Previous item"
              >
                <ChevronLeft className="w-8 h-8 transition-transform duration-200 group-hover:-translate-x-1" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(selectedImageIndex < currentItems.length - 1 ? selectedImageIndex + 1 : 0)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-green-700/80 hover:bg-green-700 text-white p-2 rounded-full transition-colors duration-200 group shadow-lg"
                aria-label="Next item"
              >
                <ChevronRight className="w-8 h-8 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Content Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {activeTab === "images" ? (
                  <Image
                    src={currentItems[selectedImageIndex].src || "/placeholder.svg"}
                    alt={currentItems[selectedImageIndex].caption}
                    width={900}
                    height={600}
                    className="max-w-full max-h-full rounded-lg border-2 border-green-700 shadow-lg object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {(() => {
                      const playbackId = getPlaybackId(currentItems[selectedImageIndex].videoUrl || "")
                      return (
                        <MuxPlayer
                          playbackId={playbackId}
                          metadata={{
                            video_id: currentItems[selectedImageIndex].id,
                            video_title: currentItems[selectedImageIndex].title,
                          }}
                          streamType="on-demand"
                          autoPlay
                          style={{
                            width: "100%",
                            height: "100%",
                            maxWidth: "100%",
                            maxHeight: "100%",
                          }}
                          playsInline
                          // Suppress HLS errors by handling them gracefully
                          onError={(e) => {
                            console.warn("Video playback issue (this is normal for some formats):", e)
                          }}
                          // Add fallback handling
                          onLoadedData={() => console.log("Video loaded successfully")}
                        />
                      )
                    })()}
                  </div>
                )}

                {/* Close Button */}
                <Button
                  variant="outline"
                  onClick={() => setSelectedImageIndex(null)}
                  className="absolute top-4 right-4 border-white hover:bg-white/20 
                  hover:text-white group rounded-full shadow-lg z-20"
                >
                  <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                </Button>

                {/* Counter */}
                <div className="absolute bottom-4 left-4 bg-green-700/80 text-white px-3 py-1 rounded-full backdrop-blur-sm shadow-lg z-20">
                  {selectedImageIndex + 1} / {currentItems.length}
                </div>
              </div>

              {/* Caption - positioned outside video area */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
                <div className="p-4 bg-[#fffaf0]/95 dark:bg-gray-800/95 rounded-lg border border-green-700 backdrop-blur-sm shadow-lg">
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif text-center mb-2">
                    {currentItems[selectedImageIndex].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-serif text-center">
                    {currentItems[selectedImageIndex].caption}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTop />
    </div>
  )
}
