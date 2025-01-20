import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function EventsPage() {
  //events data
  const events = [
    {
      id: 1,
      title: "Book Club Meeting",
      date: "February 1st, 2025",
      description: "Join us for our monthly book club meeting to discuss the latest read! The Silent Patient by Alex Michaelides.",
      imageUrl: "/feb-poster.jpeg",
      link: "https://meet.google.com/ibt-birz-rtm",
    },
    {
      id: 2,
      title: "February Outing Book Discussion",
      date: "February 22nd, 2025",
      description: "A special book discussion at the local park. Bring your own picnic!",
      imageUrl: "/park.jpg",
      link: "",
    },
  ];

  return (
    <div className="max-w-screen-lg mx-auto py-12 px-4 lg:px-8 space-y-12 text-white">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Upcoming Events</h1>

      {/* Events List */}
      <div className="space-y-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Event Image */}
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
                {/* Event Title and Date */}
                <div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-500">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.date}</p>
                </div>
              </div>

              {/* Button */}
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-200 hover:text-white"
              >
                <Link href={event.link} target="_blank" className="text-green-600 dark:text-green-500">
                  Event Link
                </Link>
              </Button>

            </div>

            {/* Event Description */}
            <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
