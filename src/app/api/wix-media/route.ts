import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { cache } from "@/lib/cache"

const CACHE_KEY = "gallery-preview"
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export async function GET() {
  try {
    // Check cache first
    const cachedData = cache.get<any[]>(CACHE_KEY)
    if (cachedData && cachedData.length > 0) {
      console.log("Serving gallery preview from cache")
      return NextResponse.json(cachedData)
    }

    // Fetch gallery items from Wix with a longer timeout
    console.log("Fetching gallery preview from Wix")
    const client = await getServerClient()

    // Fetch gallery items from Wix CMS with a timeout
    const galleryDataPromise = new Promise<any[]>(async (resolve, reject) => {
      // Set a timeout for the entire operation
      const timeout = setTimeout(() => {
        reject(new Error("Gallery data fetch timed out after 10 seconds"))
      }, 10000)

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

    // If we got no data, return an empty array rather than failing
    if (!galleryData || !Array.isArray(galleryData) || galleryData.length === 0) {
      console.warn("No gallery data returned from Wix")
      return NextResponse.json([])
    }

    // Filter out any null or undefined values
    const galleryItems = galleryData.filter(
      (item): item is { _id: string; title: string; caption: string; isVideo?: boolean; image?: any } =>
        !!item && typeof item === "object",
    )

    // Process the gallery items to add proper image URLs
    const processedGalleryItems = galleryItems.map((item) => {
      // Get the image URL
      let imageUrl = "/placeholder.svg"

      try {
        if (item.image) {
          imageUrl = convertWixImageToUrl(item.image)
        }
      } catch (error) {
        console.error("Error converting Wix image URL:", error)
      }

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

    // Cache the result
    cache.set(CACHE_KEY, randomGalleryItems, CACHE_TTL)

    return NextResponse.json(randomGalleryItems)
  } catch (error) {
    console.error("Error in gallery preview API:", error)
    // Return an empty array instead of an error to prevent client-side failures
    return NextResponse.json([])
  }
}
