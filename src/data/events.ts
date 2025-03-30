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
      title: "Children's home visit",
      date: new Date(2025, 3, 19),
      time: "12:00 PM - 4:00 PM",
      location: "Better Living Children's Home: Zimmerman, Nairobi",
      moderators: ["Esther Mboche", "Alice Wainaina", "Brenda Frenjo", "Fred Juma", "Grace Kamau"],
      description: "Join us with Community Service Club for a visit to the children's home. We will be donating books and other items to the children.",
      imageUrl: "/childrens-home.webp",
      link: "",
      eventDate: "April 19, 2025",
      bookTitle: "THEME: Little Hearts, Big Dreams",
      type: "Community Service",
    },
    {
      id: 2,
      title: "THEME: Little Hearts, Big Dreams",
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
      id: 3,
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
