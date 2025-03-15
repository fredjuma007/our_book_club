import type { Event } from "./events"

// Export the previous events data
export const previousEvents: Event[] = [
  {
    id: 101,
    title: "Picnic Romance Book Club Meeting",
    date: new Date(2025, 1, 22), // February 14, 2025
    time: "2:00 PM - 5:00 PM",
    location: "Virtual",
    moderators: ["John", "Lizz"],
    description: "A special outdoor Day book club meeting discussing the romance book of the month. Did bottle painting and Poetry exchange!",
    imageUrl: "/gallery/bottles.jpg",
    link: "",
    eventDate: "February 22, 2025",
    bookTitle: "Vicious (Sinner's of Saint #1)",
    type: "Outdoor Book Discussion",
  },
  {
    id: 102,
    title: "Collaborative Paint & Sip Book Club Meeting with Lit Nomads",
    date: new Date(2024, 10, 30), // November 30, 2024
    time: "1:00 PM - 6:00 PM",
    location: "The Piano Building, Westlands",
    moderators: ["Emily Wanjah (Reading Circle)", "Esther Ndunge (Reading Circle)"],
    description: "A collaborative book club meeting with Lit Nomads. Discussing the book of the month and painting together!",
    imageUrl: "/gallery/paint n sip.jpg",
    link: "",
    eventDate: "November 30, 2024",
    bookTitle: "Tomorrow And Tomorrow And Tomorrow",
    type: "Collaborative Book Discussion",
  },
  {
    id: 103,
    title: "Physical Book Discussion",
    date: new Date(2024, 6, 27), // July 31, 2024
    time: "2:00 PM - 6:00 PM",
    location: "The Piano Building, Westlands",
    moderators: ["Brenda Frenjo"],
    description: "A physical book club meeting discussing the book of the month",
    imageUrl: "/gallery/sinners3.jpeg",
    link: "",
    eventDate: "July 27, 2024",
    bookTitle: "Sinners",
    type: "Book Discussion",
  },
]
