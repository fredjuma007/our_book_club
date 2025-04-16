import { convertWixEventData } from "@/lib/event-utils";
import EventsClient from "@/components/events-client";
import { getServerClient } from "@/lib/wix";

type EventsPageProps = {
  searchParams?: {
    filter?: string;
  };
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const filter = (await searchParams)?.filter || "all";

  try {
    const client = await getServerClient();

    const response = await client.items
      .queryDataItems({ dataCollectionId: "Events" })
      .find();

    // Filter out any null or invalid event items to satisfy TypeScript
    const eventsData = response.items
      .map((item) => convertWixEventData(item.data || {}))
      .filter(
        (event): event is { date: string; isPast?: boolean; _id: string; title: string; time: string; location: string; moderators: string[]; description: string } =>
          !!event &&
          typeof event.date === "string" &&
          typeof event._id === "string" &&
          typeof event.title === "string" &&
          typeof event.time === "string" &&
          typeof event.location === "string" &&
          Array.isArray(event.moderators) &&
          event.moderators.every((mod) => typeof mod === "string") &&
          typeof event.description === "string"
      );

    const currentDate = new Date();

    const upcomingEvents = eventsData.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= currentDate && !event.isPast;
    });

    const pastEvents = eventsData.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate < currentDate || event.isPast;
    });

    return (
      <EventsClient
        eventsData={eventsData}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        filter={filter}
      />
    );
  } catch (error) {
    console.error("Error in events page:", error);

    return (
      <div className="min-h-screen bg-[#f5f0e1] dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Events</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We encountered an error while loading the events. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
