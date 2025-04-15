import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import GalleryClient from "@/components/gallery-client"

export default async function GalleryPage() {
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

  // Filter out any null or undefined values to satisfy TypeScript
  const galleryItems = galleryData.filter(
    (
      item,
    ): item is {
      _id: string
      title: string
      caption: string
      isVideo?: boolean
      videoUrl?: string
      image?: any
      date?: string
      category?: string
    } => !!item && typeof item === "object",
  )

  // Process the gallery items to add proper image URLs
  const processedGalleryItems = galleryItems.map((item) => ({
    id: item._id,
    title: item.title || "",
    caption: item.caption || "",
    src: item.image ? convertWixImageToUrl(item.image) : "/placeholder.svg",
    isVideo: item.isVideo || false,
    videoUrl: item.videoUrl || "",
    date: item.date || "",
    category: item.category || "",
  }))

  return <GalleryClient galleryItems={processedGalleryItems} />
}
