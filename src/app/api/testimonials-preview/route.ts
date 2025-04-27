import { getServerClient } from "@/lib/wix"
import { convertWixImageToUrl } from "@/lib/wix-client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const client = await getServerClient()

    // Fetch testimonials from Wix CMS
    const testimonialsData = await client.items
      .queryDataItems({ dataCollectionId: "Testimonials" })
      .find()
      .then((res) => res.items.map((item) => item.data || {}))

    // Process testimonials
    const testimonialItems = testimonialsData.filter(
      (item): item is { _id: string; name: string; role: string; quote: string; avatar?: any } =>
        !!item && typeof item === "object",
    )

    // Process the testimonial items to add proper image URLs
    const processedTestimonials = testimonialItems.map((item) => {
      // Get the avatar URL with error handling
      let avatarUrl = "/placeholder.svg?height=60&width=60"
      try {
        if (item.avatar) {
          avatarUrl = convertWixImageToUrl(item.avatar)
        }
      } catch (error) {
        console.error("Error converting avatar URL:", error)
      }

      return {
        id: item._id,
        name: item.name || "",
        role: item.role || "",
        quote: item.quote || "",
        avatar: avatarUrl,
      }
    })

    // Shuffle the testimonials array to get random items
    const shuffledTestimonials = [...processedTestimonials]
    for (let i = shuffledTestimonials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledTestimonials[i], shuffledTestimonials[j]] = [shuffledTestimonials[j], shuffledTestimonials[i]]
    }

    // Take the first 3 testimonials for the preview
    const randomTestimonials = shuffledTestimonials.slice(0, 3)

    return NextResponse.json(randomTestimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json([], { status: 500 })
  }
}
