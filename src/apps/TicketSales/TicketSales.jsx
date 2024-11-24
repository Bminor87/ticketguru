import { useState } from "react";
import { Stack, Box } from "@mui/material";

import EventDropDown from "./EventDropDown";
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
    <div className="bg-white dark:bg-gray-800 text-gray-500 dark:text-white">
      <Stack direction="row" spacing={2}>
        <Box sx={{ m: 1, width: 500 }}>
          <EventDropDown
            selectedEventId={selectedEventId}
            setSelectedEventId={handleEventSelect}
          />
        </Box>
        <Box sx={{ m: 1, width: 500 }}>
          <TicketOrderControl
            selectedEventId={selectedEventId}
            selectedEventName={selectedEventName}
            selectedTicketTypeId={selectedTicketTypeId}
            setSelectedTicketTypeId={setSelectedTicketTypeId}
          />
        </Box>
      </Stack>
      <Stack direction="column" spacing={2} width={1020}>
        <Basket
          setSoldTicketsData={handleSetSoldTicketsData}
          setSelectedEventId={setSelectedEventId}
          setSelectedTicketTypeId={setSelectedTicketTypeId}
        />
        <SoldTicketsList soldTicketsData={soldTicketsData} />
      </Stack>
    </div>
  );
}
