"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
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
  Video,
  BookMarked,
  BookOpen,
  CalendarCheck,
  Download,
  AlertCircle,
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
  const [activeSection, setActiveSection] = useState<string>("images")
  const images = galleryItems?.filter((item) => !item.isVideo) || []
  const videos = galleryItems?.filter((item) => item.isVideo) || []

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [videoSources, setVideoSources] = useState<{ mp4?: string; webm?: string; ogg?: string }>({})

  // Optimized Click Handler
  const openImage = useCallback((index: number) => {
    setSelectedImageIndex(index)
  }, [])

  // Replace the handleVideoError function with this enhanced version
  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.target as HTMLVideoElement

    // Log detailed information about the video element
    console.error("Video error details:", {
      videoElement: videoElement,
      src: videoElement.src,
      currentSrc: videoElement.currentSrc,
      error: videoElement.error
        ? {
            code: videoElement.error.code,
            message: videoElement.error.message,
          }
        : "No error details available",
      networkState: videoElement.networkState,
      readyState: videoElement.readyState,
    })

    // Provide more specific error messages based on the error code
    let errorMessage = "Unable to play this video. "

    if (videoElement.error) {
      switch (videoElement.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage += "The video playback was aborted."
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage += "A network error occurred while trying to load the video."
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage += "The video format is not supported by your browser."
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage +=
            "The video file could not be loaded, either because the server or network failed, or because the format is not supported."
          break
        default:
          errorMessage += "An unknown error occurred."
      }
    }

    setVideoError(errorMessage)
  }, [])

  // Add this function to test the video URL before playing
  const testVideoUrl = useCallback((url: string) => {
    if (!url) return

    console.log("Testing video URL:", url)

    // Create a temporary video element to test the URL
    const testVideo = document.createElement("video")

    // Add event listeners to check if the video can be loaded
    testVideo.addEventListener("loadedmetadata", () => {
      console.log("Video metadata loaded successfully:", {
        duration: testVideo.duration,
        videoWidth: testVideo.videoWidth,
        videoHeight: testVideo.videoHeight,
      })
    })

    testVideo.addEventListener("error", (e) => {
      console.error("Test video error:", {
        error: testVideo.error
          ? {
              code: testVideo.error.code,
              message: testVideo.error.message,
            }
          : "No error details available",
      })
    })

    // Set the source and try to load it
    testVideo.src = url
    testVideo.load()
  }, [])

  // Modify the openVideo function to test the URL
  const openVideo = useCallback(
    (index: number) => {
      setSelectedVideoIndex(index)
      setVideoError(null) // Reset error state when opening a new video

      // Set video sources
      if (videos[index]?.videoUrl) {
        const baseUrl = videos[index].videoUrl
        console.log("Opening video with URL:", baseUrl)

        // Test the video URL
        testVideoUrl(baseUrl)

        setVideoSources({
          mp4: baseUrl, // Default to mp4
        })
      } else {
        setVideoSources({})
      }
    },
    [videos, testVideoUrl],
  )

  // Log video URLs for debugging
  useEffect(() => {
    if (videos.length > 0) {
      console.log(
        "Available videos:",
        videos.map((v) => ({ title: v.title, url: v.videoUrl })),
      )
    }
  }, [videos])

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

          {/* Navigation Pills - Similar to Events Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <div
              onClick={() => setActiveSection("images")}
              className={`${
                activeSection === "images"
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ImageIcon className="w-5 h-5 mr-2" />
              Images
            </div>
            <div
              onClick={() => setActiveSection("videos")}
              className={`${
                activeSection === "videos"
                  ? "bg-green-700 text-white"
                  : "text-green-700 border-green-700 hover:bg-green-200"
              } font-serif relative overflow-hidden group px-4 py-2 rounded-md border cursor-pointer flex items-center`}
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Video className="w-5 h-5 mr-2" />
              Videos
            </div>

            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-200 font-serif group relative overflow-hidden"
            >
              <Link className="text-green-700 dark:text-white flex items-center gap-1" href="/books">
                <BookOpen className="w-4 h-4 mr-2" /> <span>Books</span>
              </Link>
            </Button>

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
        {/* Images Section */}
        {activeSection === "images" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-700 mb-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center">
                <ImageIcon className="w-6 h-6 mr-2 text-green-700" />
                Photo Gallery
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
                Browse through our collection of photos from book club meetings, events, and special moments.
              </p>
            </div>

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
                <p className="text-gray-600 dark:text-gray-300 font-serif">
                  Check back soon for images from our events!
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Videos Section */}
        {activeSection === "videos" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-[#fffaf0] dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-700 mb-8">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-4 flex items-center">
                <Video className="w-6 h-6 mr-2 text-green-700" />
                Video Gallery
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-serif">
                Watch recordings from our book discussions, author interviews, and special events.
              </p>
            </div>

            {videos.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    layout
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <div
                      className="relative bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-float"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="relative aspect-video cursor-pointer group" onClick={() => openVideo(index)}>
                        <Image
                          src={video.src || "/placeholder.svg"}
                          alt={video.caption}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <p className="text-white text-sm px-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Click to play
                          </p>
                        </div>
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-green-700/80 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-green-800 dark:text-green-500 font-serif mb-1">{video.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-serif line-clamp-2">
                          {video.caption}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-[#fffaf0] dark:bg-gray-800 rounded-xl shadow-lg border border-green-700">
                <Video className="w-16 h-16 mx-auto text-green-700/50 mb-4" />
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-500 font-serif mb-2">
                  No Videos Available
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-serif">
                  Check back soon for video content from our events!
                </p>
              </div>
            )}
          </motion.div>
        )}
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

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {selectedVideoIndex !== null && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVideoIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-black/50 rounded-lg border-2 border-green-700 shadow-lg overflow-hidden">
                {videoError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <AlertCircle className="w-16 h-16 text-green-700/50 mb-4" />
                    <h3 className="text-xl font-bold text-center mb-2">Video Playback Error</h3>
                    <p className="text-center mb-4">{videoError}</p>
                    <div className="text-center text-sm mb-4 max-w-md mx-auto overflow-auto max-h-32 bg-black/30 p-2 rounded">
                      <p className="font-mono text-xs">
                        Video URL: {videos[selectedVideoIndex]?.videoUrl || "No URL available"}
                      </p>
                    </div>
                    <p className="text-center text-sm">
                      Try downloading the video instead or contact the administrator if the issue persists.
                    </p>
                    {videos[selectedVideoIndex]?.videoUrl && (
                      <a
                        href={videos[selectedVideoIndex].videoUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-4 h-4" />
                        Download Video
                      </a>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Use multiple source formats for better browser compatibility */}
                    <video
                      controls
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full"
                      onError={handleVideoError}
                      crossOrigin="anonymous" // Add cross-origin attribute to help with CORS issues
                    >
                      {videoSources.mp4 && <source src={videoSources.mp4} type="video/mp4" />}
                      {videoSources.webm && <source src={videoSources.webm} type="video/webm" />}
                      {videoSources.ogg && <source src={videoSources.ogg} type="video/ogg" />}
                      Your browser does not support the video tag.
                    </video>
                    {videos[selectedVideoIndex]?.videoUrl && (
                      <a
                        href={videos[selectedVideoIndex].videoUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 flex items-center gap-2 bg-green-700/80 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-colors z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    )}
                  </>
                )}

                {/* Close Button */}
                <Button
                  variant="outline"
                  onClick={() => setSelectedVideoIndex(null)}
                  className="absolute top-4 right-4 border-white hover:bg-white/20 
                  hover:text-white group rounded-full shadow-childish z-10"
                >
                  <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                </Button>
              </div>

              {/* Caption */}
              <div className="mt-4 p-4 bg-[#fffaf0] dark:bg-gray-800 rounded-lg border border-green-700 backdrop-blur-sm shadow-lg">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-500 font-serif text-center mb-2">
                  {videos[selectedVideoIndex].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-serif text-center">
                  {videos[selectedVideoIndex].caption}
                </p>
                <div className="mt-2 text-center text-xs text-gray-500">
                  <p>Video ID: {videos[selectedVideoIndex].id}</p>
                  <p>Video URL: {videos[selectedVideoIndex].videoUrl}</p>
                </div>
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
