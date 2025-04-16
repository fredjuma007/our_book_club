import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import HomePageClient from "./home-client"

export default async function HomePage() {
  let randomGalleryItems: {
    id: string
    title: string
    caption: string
    src: string
    isVideo: boolean
    date: string
    category: string
  }[] = []

  try {
    // Fetch gallery items from Wix for the preview
    const client = await getServerClient()

    // Fetch gallery items from Wix CMS
    const galleryData = await client.items
      .queryDataItems({ dataCollectionId: "Gallery" })
      .find()
      .then((res) => res.items.map((item) => item.data || {}))
      .catch((error) => {
        console.error("Error fetching gallery items:", error)
        return []
      })

    // Filter out any null or undefined values
    const galleryItems = galleryData.filter(
      (
        item,
      ): item is {
        _id: string
        title: string
        caption: string
        isVideo?: boolean
        image?: any
        date?: string
        category?: string
      } => !!item && typeof item === "object",
    )

    // Process the gallery items to add proper image URLs
    const processedGalleryItems = galleryItems.map((item) => {
      // Get the image URL with error handling
      let imageUrl = "/placeholder.svg"
      try {
        if (item.image) {
          imageUrl = convertWixImageToUrl(item.image)
        }
      } catch (error) {
        console.error("Error converting image URL:", error)
      }

      return {
        id: item._id,
        title: item.title || "",
        caption: item.caption || "",
        src: imageUrl,
        isVideo: item.isVideo || false,
        date: item.date || "",
        category: item.category || "",
      }
    })

    // Shuffle the array to get random items
    const shuffled = [...processedGalleryItems]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Take the first 3 items for the preview
    randomGalleryItems = shuffled.slice(0, 3)
  } catch (error) {
    console.error("Error fetching gallery data:", error)
    // Leave randomGalleryItems as an empty array
  }

  return <HomePageClient initialGalleryItems={randomGalleryItems} />
}
