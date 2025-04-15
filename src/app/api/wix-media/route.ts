import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const fileName = request.nextUrl.searchParams.get("fileName")
    const directUrl = request.nextUrl.searchParams.get("directUrl") === "true"

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName parameter" }, { status: 400 })
    }

    console.log("API route: Received Wix media file request:", fileName)
    console.log("API route: directUrl parameter:", directUrl)

    // Check if this is a Wix video URL format
    if (fileName.startsWith("wix:video://")) {
      try {
        // Parse the Wix video URL to extract components
        // Format: wix:video://v1/[videoId]/[filename]#posterUri=[posterImage]&posterWidth=[width]&posterHeight=[height]
        const videoMatch = fileName.match(/wix:video:\/\/v1\/([^/]+)\/([^#]+)/)

        if (!videoMatch) {
          return NextResponse.json({ error: "Invalid Wix video URL format" }, { status: 400 })
        }

        const videoId = videoMatch[1]
        const videoFilename = videoMatch[2]

        console.log("API route: Parsed Wix video URL:", { videoId, videoFilename })

        // Construct the direct video URL using Wix's video CDN pattern
        // Try multiple possible URL patterns
        const possibleUrls = [
          `https://video.wixstatic.com/video/${videoId}/${videoFilename}`,
          `https://static.wixstatic.com/media/${videoId}/${videoFilename}`,
          `https://static.wixstatic.com/media/${videoId}_${videoFilename}`,
        ]

        console.log("API route: Trying possible video URLs:", possibleUrls)

        if (directUrl) {
          // If directUrl is specified, redirect to the first possible URL
          console.log("API route: Redirecting to direct video URL:", possibleUrls[0])

          return new Response(null, {
            status: 302, // Temporary redirect
            headers: {
              Location: possibleUrls[0],
              "Cache-Control": "public, max-age=86400", // Cache for 24 hours
            },
          })
        }

        // Try to fetch from each possible URL until one works
        let response = null
        let successUrl = null

        for (const url of possibleUrls) {
          console.log("API route: Trying to fetch from:", url)
          try {
            response = await fetch(url, {
              method: "GET",
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept: "video/mp4,video/*;q=0.9,*/*;q=0.8",
              },
            })

            if (response.ok) {
              successUrl = url
              console.log("API route: Successfully fetched from:", url)
              break
            }
          } catch (fetchError) {
            console.log("API route: Failed to fetch from:", url, fetchError)
          }
        }

        if (!response || !response.ok) {
          console.error("API route: All URL patterns failed")
          return NextResponse.json(
            { error: "Could not access video file from any known Wix URL pattern" },
            { status: 404 },
          )
        }

        // Get the content and stream it back to the client
        const contentType = response.headers.get("content-type") || "video/mp4"
        const data = await response.arrayBuffer()

        return new Response(data, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Length": data.byteLength.toString(),
            "Cache-Control": "public, max-age=86400", // Cache for 24 hours
            "Access-Control-Allow-Origin": "*", // Allow cross-origin access
          },
        })
      } catch (parseError) {
        console.error("API route: Error parsing Wix video URL:", parseError)
        return NextResponse.json(
          {
            error: "Failed to parse Wix video URL",
            details: parseError instanceof Error ? parseError.message : String(parseError),
            originalUrl: fileName,
          },
          { status: 400 },
        )
      }
    } else {
      // For non-Wix video URLs, try the original approach
      const mediaUrl = `https://static.wixstatic.com/media/${fileName}`

      console.log("API route: Redirecting to standard media URL:", mediaUrl)

      return new Response(null, {
        status: 302, // Temporary redirect
        headers: {
          Location: mediaUrl,
          "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        },
      })
    }
  } catch (error) {
    console.error("API route: Error handling Wix media:", error)
    return NextResponse.json(
      {
        error: "Failed to process media request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
