// Define the event type
export type Event = {
    id: number
    title: string
    date: Date
    time: string
    location: string
    moderators: string[]
    description: string
    imageUrl: string
    link: string
    eventDate: string
    bookTitle: string
    type: string
  }
  
  // Export the events data
  export const events: Event[] = [
    {
      id: 1,
      title: "Book Club Meeting",
      date: new Date(2025, 2, 29),
      time: "7:00 PM - 9:00 PM",
      location: "Virtual",
      moderators: ["Christine Karori", "Immanuel Njogu"],
      description: "Join us for our monthly book club meeting to discuss the latest read!",
      imageUrl: "/march_poster.jpg",
      link: "https://meet.google.com/vhv-hfwz-avi",
      eventDate: "March 29, 2025",
      bookTitle: "Sometimes I Lie",
      type: "Book Discussion",
    },
    {
      id: 2,
      title: "Children's home visit",
      date: new Date(2025, 3, 19),
      time: "TBA",
      location: "Better Living Children's Home: Zimmerman, Nairobi",
      moderators: ["Club Member", "Club Member"],
      description: "Join us for a visit to the children's home to spend time with the kids and donate stuff!",
      imageUrl: "/childrens-home.webp",
      link: "",
      eventDate: "April 19, 2025",
      bookTitle: "TBA",
      type: "Community Service",
    },
    {
      id: 3,
      title: "Book Club Meeting",
      date: new Date(2025, 4, 3),
      time: "7:00 PM - 9:00 PM",
      location: "Virtual",
      moderators: ["Club Member", "Club Member"],
      description: "Join us for our monthly book club meeting to discuss the latest read!",
      imageUrl: "/gallery/Esther.jpg",
      link: "https://meet.google.com/vhv-hfwz-avi",
      eventDate: "May 3, 2025",
      bookTitle: "TBA",
      type: "Book Discussion",
    },
    {
      id: 4,
      title: "Book Club Meeting",
      date: new Date(2025, 4, 31),
      time: "7:00 PM - 9:00 PM",
      location: "Virtual",
      moderators: ["Club Member", "Club Member"],
      description: "Join us for our monthly book club meeting to discuss the latest read!",
      imageUrl: "/gallery/Discussion.jpg",
      link: "https://meet.google.com/vhv-hfwz-avi",
      eventDate: "May 31, 2025",
      bookTitle: "TBA",
      type: "Book Discussion",
    },
  ]
