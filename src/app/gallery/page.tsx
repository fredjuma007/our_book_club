"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GalleryPage() {
  const images = [
    { src: "/gallery/sinners.jpg", caption: "First Physical Meeting under name Reading Circle (sinners club)" },
    { src: "/gallery/sinners (1).jpg", caption: "First Physical Meeting under name Reading Circle (sinners club)" },
    { src: "/gallery/pathway.jpg", caption: "Open day. Hey we had a booth" },
    { src: "/gallery/tommorow(3).jpg", caption: "November 2024 BOM review, collaboration with Lit Nomads, former Sparkle" },
    { src: "/gallery/paint n sip.jpg", caption: "Painting session with Lit Nomads" },
    { src: "/gallery/paint n sip (1).jpg", caption: "Painting session with Lit Nomads" },
    { src: "/gallery/picnic.jpg", caption: "A beautiful day at the picnic" },
    { src: "/gallery/picnic notes.jpg", caption: "A beautiful day at the picnic" },
    { src: "/gallery/bottles.jpg", caption: "Enjoying the great outdoors" },
    { src: "/gallery/picnic bottles.jpg", caption: "Group fun and laughter" },
  ];

  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);

  // Optimized Click Handler
  const openImage = useCallback((image: { src: string; caption: string }) => {
    setSelectedImage(image);
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto py-12 px-4 lg:px-8 space-y-12 text-white">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          <span className="text-green-600">Gallery 📸</span>
        </h1>

        <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-200 hover:text-white">
          <Link href="/club-events" className="text-green-600 dark:text-green-500">
            Events 👯‍♂️
          </Link>
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <Image
              src={image.src}
              alt={image.caption}
              width={300}
              height={200}
              className="w-full h-64 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onClick={() => openImage(image)}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}

// Separate Modal Component for Performance Optimization
const Modal = ({ image, onClose }: { image: { src: string; caption: string }; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50" onClick={onClose}>
      <div className="relative">
        {/* Full-size Image */}
        <Image src={image.src} alt={image.caption} width={900} height={600} className="max-w-full max-h-[80vh] rounded-lg border-4 border-green-500 shadow-lg" />

        {/* Caption */}
        <p className="text-white text-lg mt-4">{image.caption}</p>

        {/* Close Button */}
        <Button
          variant="outline"
          className="absolute top-4 right-4 text-white border-green-600 hover:bg-green-600 hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};
