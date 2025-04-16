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
  return eventDate < currentDate
}

export function convertWixEventData(wixData: any): Event {
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
    isPast: wixData.isPast || isEventPast(wixData.date),
  }
}
