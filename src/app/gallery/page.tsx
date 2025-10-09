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
          .query("Gallery")
          .find()
          .then((res) => res.items)
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
        videoUrl?: string
        date?: any
        category?: string
      } => !!item && typeof item === "object",
    )

    processedGalleryItems = galleryItems
      .filter((item) => !item.isVideo)
      .map((item) => {
        // Handle date conversion - check if it's an object with $date property
        let dateString = ""
        if (item.date) {
          if (typeof item.date === "object" && item.date.$date) {
            // Handle MongoDB-style date object
            dateString = new Date(item.date.$date).toLocaleDateString()
          } else if (typeof item.date === "string") {
            // Handle string date
            dateString = item.date
          } else if (item.date instanceof Date) {
            // Handle Date object
            dateString = item.date.toLocaleDateString()
          } else {
            // Try to convert whatever it is to a date
            try {
              dateString = new Date(item.date).toLocaleDateString()
            } catch {
              dateString = ""
            }
          }
        }

        return {
          id: item._id,
          title: item.title || "",
          caption: item.caption || "",
          src: item.image ? convertWixImageToUrl(item.image) : "/placeholder.svg",
          date: dateString,
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
