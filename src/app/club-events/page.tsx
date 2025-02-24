"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

export default function EventsPage() {
  // State for the selected date
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Events data
  const events = [
    {
      id: 1,
      title: "Book Club Meeting",
      date: new Date(2025, 2, 29), // highlighted date
      moderators: ["BookClub Member", "Immanuel Njogu"],
      description:
        "Join us for our monthly book club meeting to discuss the latest read!.",
      imageUrl: "/logo.jpeg",
      link: "",
    },
  ];

  // Create a set of event dates for easy comparison
  const eventDates = new Set(events.map((event) => event.date.toDateString()));

  // Define custom modifiers
  const modifiers = {
    highlighted: (day: Date) => eventDates.has(day.toDateString()),
  };

  // Define custom styles for modifiers
  const modifiersClassNames = {
    highlighted: "bg-green-600 text-white rounded-full", // Highlighted date styling
  };

  return (
    <div className="max-w-screen-lg mx-auto py-12 px-4 lg:px-8 space-y-12 text-white">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
        Upcoming <span className="text-green-600">Events</span>
      </h1>

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
                  width={150}
                  height={120}
                  className="rounded-lg"
                />
                {/* Event Title and Date */}
                <div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-500">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.date.toDateString()}
                  </p>
                </div>
              </div>

              {/* Button */}
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-200 hover:text-white"
              >
                <Link href={event.link} target="_blank" className="text-green-600 dark:text-green-500">
                  Link
                </Link>
              </Button>
            </div>

            {/* Event Description */}
            <p className="text-gray-700 dark:text-gray-300">{event.description}</p>

            {/* Moderators */}
            <div className="mt-4">
              <p className="font-semibold text-green-600 dark:text-green-500">Moderators:</p>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {event.moderators.map((moderator, index) => (
                  <li key={index}>{moderator}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Section */}
      <div className="mt-12 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-500 mb-4">Event Calendar</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Calendar for current month */}
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={new Date()} // Current month
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border text-gray-800 dark:text-gray-200" // Added text color for light theme
            />
          </div>
          {/* Calendar for next month */}
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={new Date(new Date().setMonth(new Date().getMonth() + 1))} // Next month
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border text-gray-800 dark:text-gray-200" // Added text color for light theme
            />
          </div>
          {/* Calendar for the month after next */}
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={new Date(new Date().setMonth(new Date().getMonth() + 2))} // Month after next
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border text-gray-800 dark:text-gray-200" // Added text color for light theme
            />
          </div>
        </div>
      </div>
    </div>
  );
}
