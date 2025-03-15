// Define the gallery item type
export type GalleryItem = {
    id: number
    src: string
    caption: string
    featured?: boolean // To mark images that should appear on the homepage
  }
  
  // Export the gallery data
  export const galleryItems: GalleryItem[] = [
    {
      id: 1,
      src: "/gallery/sinners.jpg",
      caption: "First Physical Meeting under name Reading Circle (sinners club)",
      featured: true,
    },
    {
      id: 2,
      src: "/gallery/sinners (1).jpg",
      caption: "First Physical Meeting under name Reading Circle (sinners club)",
      featured: true,
    },
    {
      id: 3,
      src: "/gallery/pathway.jpg",
      caption: "Open day. Hey we had a booth",
      featured: true,
    },
    {
      id: 4,
      src: "/gallery/tommorow(3).jpg",
      caption: "November 2024 BOM review, collaboration with Lit Nomads, former Sparkle",
      featured: true,
    },
    {
      id: 5,
      src: "/gallery/paint n sip.jpg",
      caption: "Painting session with Lit Nomads",
      featured: true,
    },
    {
      id: 6,
      src: "/gallery/paint n sip (1).jpg",
      caption: "Painting session with Lit Nomads",
      featured: true,
    },
    {
      id: 7,
      src: "/gallery/Discussion.jpg",
      caption: "Moderators During A book Review",
      featured: true,
    },
    {
      id: 8,
      src: "/gallery/picnic.jpg",
      caption: "A beautiful day at the picnic",
      featured: true,
    },
    {
      id: 9,
      src: "/gallery/picnic notes.jpg",
      caption: "A beautiful day at the picnic",
      featured: true,
    },
    {
      id: 10,
      src: "/gallery/bottles.jpg",
      caption: "Enjoying the great outdoors",
      featured: true,
    },
    {
      id: 11,
      src: "/gallery/picnic bottles.jpg",
      caption: "Group fun and laughter",
      featured: true,
    },
  ]
    