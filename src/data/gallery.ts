export interface GalleryItem {
  id: string
  src: string
  caption: string
  isVideo?: boolean
  videoUrl?: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Our first book club meeting discussing 'The Great Gatsby'",
  },
  {
    id: "2",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Summer reading retreat at Lakeside Park",
  },
  {
    id: "3",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Author visit and book signing with local writer Jane Smith",
  },
  {
    id: "4",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Holiday book exchange party",
  },
  {
    id: "5",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Reading corner setup at the community library",
  },
  {
    id: "6",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Book club members at the annual literary festival",
  },
  {
    id: "7",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Children's reading hour organized by our members",
  },
  {
    id: "8",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Poetry night under the stars",
  },
  // Video examples
  {
    id: "v1",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Interview with bestselling author John Doe",
    isVideo: true,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "v2",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Book club discussion on 'To Kill a Mockingbird'",
    isVideo: true,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "v3",
    src: "/placeholder.svg?height=400&width=600",
    caption: "Virtual tour of Shakespeare's Globe Theatre",
    isVideo: true,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
]
