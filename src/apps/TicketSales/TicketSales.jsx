import { useEffect, useState } from "react";

import EventControl from "./EventControl";
import TicketOrderControl from "./TicketOrderControl";
import Basket from "./Basket";
import SoldTicketsList from "./SoldTicketsList";
import EventDropDown from "../../common/EventDropDown";
import { useApiService } from "../../service/ApiProvider";

export default function TicketSales() {
  const { fetchEvents, fetchVenues } = useApiService();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [soldTicketsData, setSoldTicketsData] = useState(null);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleEventSelect = (eventId, eventName) => {
    setSelectedEventId(eventId);
    setSelectedEventName(events.find((event) => event.id === eventId).name);
  };

  const handleSetSoldTicketsData = (data) => {
    setSoldTicketsData(data);
  };

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await fetchEvents();
      const fetchedVenues = await fetchVenues();
      setEvents(fetchedEvents || []);
      setVenues(fetchedVenues || []);
      setIsLoading(false);
    };
    loadEvents();
  }, [fetchEvents]);

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  return (
    <div id="TicketSales" className="text-gray-500 dark:text-white">
      <div className="w-full">
        <div className="w-full mb-8">
          {isLoading ? (
            <p>Loading events...</p>
          ) : (
            <EventDropDown
              selectedEventId={selectedEventId}
              setSelectedEventId={handleEventSelect}
              events={events}
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-8">
        <div className="flex-1 min-w-[320px] max-w-[720px]">
          {/* Event details */}
          <EventControl selectedEvent={selectedEvent} venues={venues} />
        </div>
        <div className="flex-1 min-w-[320px] max-w-[720px]">
          <TicketOrderControl
            selectedEventId={selectedEventId}
            selectedEventName={selectedEventName}
            selectedTicketTypeId={selectedTicketTypeId}
            setSelectedTicketTypeId={setSelectedTicketTypeId}
          />
        </div>
      </div>

      {/* Responsive container for the basket and sold tickets list */}
      <div className="mt-6 flex flex-col gap-6">
        <div>
          <Basket
            setSoldTicketsData={handleSetSoldTicketsData}
            setSelectedEventId={setSelectedEventId}
            setSelectedTicketTypeId={setSelectedTicketTypeId}
          />
        </div>
        <div>
          <SoldTicketsList soldTicketsData={soldTicketsData} />
        </div>
      </div>
    </div>
  );
}
