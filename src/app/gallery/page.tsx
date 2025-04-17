import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import GalleryClient, { type GalleryItem } from "@/app/gallery/gallery-client"
import ErrorBoundary from "@/components/error-boundary"

export default async function GalleryPage() {
  let processedGalleryItems: GalleryItem[] = []

  try {
    const client = await getServerClient()

    // Fetch gallery items from Wix CMS with a timeout
    const galleryDataPromise = new Promise<any[]>(async (resolve, reject) => {
      // Set a timeout for the entire operation
      const timeout = setTimeout(() => {
        reject(new Error("Gallery data fetch timed out after 15 seconds"))
      }, 15000)

      try {
        const data = await client.items
          .queryDataItems({ dataCollectionId: "Gallery" })
          .find()
          .then((res) => res.items.map((item) => item.data || {}))
          .catch((error) => {
            console.error("Error fetching gallery items:", error)
            return []
          })

        clearTimeout(timeout)
        resolve(data)
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })

    // Wait for the data with a timeout
    const galleryData = await galleryDataPromise

    // Filter out any null or undefined values to satisfy TypeScript
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

    // Process only image items (filter out videos)
    const imageItems = galleryItems.filter((item) => !item.isVideo)

    // Process the gallery items to add proper image URLs
    processedGalleryItems = imageItems.map((item) => {
      return {
        id: item._id,
        title: item.title || "",
        caption: item.caption || "",
        src: item.image ? convertWixImageToUrl(item.image) : "/placeholder.svg",
        isVideo: false, // Always false since we're filtering out videos
        date: item.date || "",
        category: item.category || "",
      }
    })
  } catch (error) {
    console.error("Error fetching gallery data:", error)
    // Leave processedGalleryItems as an empty array
  }

  return (
    <ErrorBoundary>
      <GalleryClient galleryItems={processedGalleryItems} />
    </ErrorBoundary>
  )
}
