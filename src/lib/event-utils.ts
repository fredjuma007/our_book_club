export type Event = {
  _id: string
  title: string
  date: string
  time: string
  location: string
  moderators: string[]
  description: string
  image?: any
  link?: string
  bookTitle?: string
  bookAuthor?: string
  type?: string
  tags?: string[]
  additionalContent?: string
  isPast?: boolean
  isHappeningToday?: boolean
}

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function isEventPast(dateString: string): boolean {
  const eventDate = new Date(dateString)
  const currentDate = new Date()

  // Set both dates to start of day for accurate comparison
  eventDate.setHours(0, 0, 0, 0)
  currentDate.setHours(0, 0, 0, 0)

  return eventDate < currentDate
}

export function isEventHappeningToday(dateString: string): boolean {
  const eventDate = new Date(dateString)
  const currentDate = new Date()

  // Set both dates to start of day for accurate comparison
  eventDate.setHours(0, 0, 0, 0)
  currentDate.setHours(0, 0, 0, 0)

  return eventDate.getTime() === currentDate.getTime()
}

export function convertWixEventData(wixData: any): Event {
  const isToday = isEventHappeningToday(wixData.date)
  const isPastEvent = isEventPast(wixData.date)

  return {
    _id: wixData._id || "",
    title: wixData.title || "",
    date: wixData.date || new Date().toISOString(),
    time: wixData.time || "",
    location: wixData.location || "",
    moderators: wixData.moderators || [],
    description: wixData.description || "",
    image: wixData.image || null,
    link: wixData.link || "",
    bookTitle: wixData.bookTitle || "",
    bookAuthor: wixData.bookAuthor || "",
    type: wixData.type || "Event",
    tags: wixData.tags || [],
    additionalContent: wixData.additionalContent || "",
    isPast: wixData.isPast || isPastEvent,
    isHappeningToday: isToday,
  }
}
