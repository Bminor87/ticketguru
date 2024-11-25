import { useState } from "react";

import EventControl from "./EventControl";
import TicketOrderControl from "./TicketOrderControl";
import Basket from "./Basket";
import SoldTicketsList from "./SoldTicketsList";

export default function TicketSales() {
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [soldTicketsData, setSoldTicketsData] = useState(null);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(0);

  const handleEventSelect = (eventId, eventName) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName); // Set the event name when an event is selected
  };

  const handleSetSoldTicketsData = (data) => {
    setSoldTicketsData(data);
  };

  return (
    <div id="TicketSales" className="text-gray-500 dark:text-white">
      {/* Responsive container for the dropdowns */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[320px] max-w-[500px]">
          <EventControl
            selectedEventId={selectedEventId}
            setSelectedEventId={handleEventSelect}
          />
        </div>
        <div className="flex-1 min-w-[320px] max-w-[500px]">
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
