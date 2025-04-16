import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"

export async function GET() {
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
      (item): item is { _id: string; title: string; caption: string; isVideo?: boolean; image?: any } =>
        !!item && typeof item === "object",
    )

    // Process the gallery items to add proper image URLs
    const processedGalleryItems = galleryItems.map((item) => {
      // Get the image URL
      const imageUrl = item.image ? convertWixImageToUrl(item.image) : "/placeholder.svg"

      return {
        id: item._id,
        title: item.title || "",
        caption: item.caption || "",
        src: imageUrl,
        isVideo: item.isVideo || false,
      }
    })

    // Shuffle the array to get random items
    const shuffled = [...processedGalleryItems]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Take the first 3 items for the preview
    const randomGalleryItems = shuffled.slice(0, 3)

    return NextResponse.json(randomGalleryItems)
  } catch (error) {
    console.error("Error in gallery preview API:", error)
    return NextResponse.json({ error: "Failed to fetch gallery preview" }, { status: 500 })
  }
}
