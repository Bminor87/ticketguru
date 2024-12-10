import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";

import { useApiService } from "../../service/ApiProvider";
import {
  formatDateTime,
  findVenue,
  findEvent,
  findTicketType,
} from "../../util/helperfunctions";

import TicketViewer from "./TicketViewer";

export default function SoldTicketsList({
  soldTicketsData,
  events,
  venues,
  ticketTypes,
}) {
  const [tickets, setTickets] = useState([]);

  const { fetchTickets, fetchCity } = useApiService();

  useEffect(() => {
    if (!soldTicketsData) return;

    const getTickets = async () => {
      try {
        const ticketIds = soldTicketsData.ticketIds.toString();
        const fetchedTickets = await fetchTickets(ticketIds);

        // Fetch cities and add them to tickets
        const ticketsWithCities = await Promise.all(
          fetchedTickets.map(async (ticket) => {
            const ticketType = findTicketType(ticket.ticketTypeId, ticketTypes);
            const event = findEvent(ticketType.eventId, events);
            const venue = findVenue(event.venueId, venues);

            if (!venue) {
              console.error("Missing venue for ticket", ticket);
              return ticket; // Pass through ticket if venue is unavailable
            }

            let city = null;

            // Fetch city using the venue's zipcode
            try {
              city = await fetchCity(venue.zipcode);
            } catch (error) {
              console.error(
                `Error fetching city for zipcode: ${venue.zipcode}`,
                error
              );
            }

            return { ...ticket, city };
          })
        );

        console.log("Tickets with cities:", ticketsWithCities);
        setTickets(ticketsWithCities);
      } catch (error) {
        console.error(error);
      }
    };

    getTickets();
  }, [soldTicketsData, venues, fetchTickets, fetchCity]);

  return (
    <>
      {soldTicketsData && (
        <>
          <Box sx={{ p: 2, border: "1px dashed grey" }}>
            <strong>Sale event {soldTicketsData.id} successful!</strong>
            <br />
            <strong>
              Sale posted at: {formatDateTime(soldTicketsData.paidAt)}
            </strong>
            <br />
            <strong>Sold by user: {soldTicketsData.userId}</strong>
            <br />
          </Box>

          <PDFViewer width="100%" height="600px">
            <TicketViewer
              tickets={tickets}
              events={events}
              venues={venues}
              ticketTypes={ticketTypes}
            />
          </PDFViewer>
        </>
      )}
    </>
  );
}
