import type { Event } from "@/lib/event-utils"

/**
 * Generates a Google Calendar event URL from event data
 */
export function generateGoogleCalendarUrl(event: Event): string {
  // Format the date and time for Google Calendar
  const startDate = new Date(event.date)

  // If we have a time string, try to parse it
  if (event.time) {
    // Extract hours and minutes from time string (assuming format like "7:00 PM")
    const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)?/i)

    if (timeMatch) {
      let hours = Number.parseInt(timeMatch[1], 10)
      const minutes = Number.parseInt(timeMatch[2], 10)
      const period = timeMatch[3]?.toUpperCase()

      // Convert to 24-hour format if PM is specified
      if (period === "PM" && hours < 12) {
        hours += 12
      } else if (period === "AM" && hours === 12) {
        hours = 0
      }

      startDate.setHours(hours, minutes, 0, 0)
    }
  }

  // End date is 2 hours after start by default
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

  // Format dates for Google Calendar URL
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "")
  }

  const startDateFormatted = formatDate(startDate)
  const endDateFormatted = formatDate(endDate)

  // Prepare event details
  let details = `${event.description || ""}\n\nLocation: ${event.location || ""}`

  // Add book information if available
  if (event.bookTitle) {
    details += `\n\nBook: ${event.bookTitle}`
    if (event.bookAuthor) {
      details += ` by ${event.bookAuthor}`
    }
  }

  // Build the URL with all parameters
  const url = new URL("https://calendar.google.com/calendar/render")
  url.searchParams.append("action", "TEMPLATE")
  url.searchParams.append("text", event.title)
  url.searchParams.append("dates", `${startDateFormatted}/${endDateFormatted}`)
  url.searchParams.append("details", details)
  url.searchParams.append("location", event.location || "")

  return url.toString()
}
