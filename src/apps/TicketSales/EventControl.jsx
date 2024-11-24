import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useApiService } from "../../service/ApiProvider";
import { formatDateTime } from "../../util/helperfunctions";

import EventDropDown from "../../common/EventDropDown";

export default function EventControl({ selectedEventId, setSelectedEventId }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { fetchEvents } = useApiService();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error(error);
      }
    };
    getEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId !== 0) {
      const event = events?.find((event) => event.id === selectedEventId); // Use eventId
      setSelectedEvent(event || null);
    } else {
      setSelectedEvent(null);
    }
  }, [selectedEventId, events]);

  const handleChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
  };

  useEffect(() => {
    if (selectedEvent) {
      setSelectedEventId(selectedEventId, selectedEvent.name);
    }
  }, [selectedEvent]);

  return (
    <Stack>
      <EventDropDown
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        events={events}
      />
      <Table
        size="small"
        sx={{ mt: 2 }}
        className={selectedEventId ? "" : "hidden"}
      >
        <TableBody>
          <TableRow>
            <TableCell>Event name</TableCell>
            <TableCell>{selectedEvent?.name || ""}</TableCell>{" "}
            {/* Use eventName */}
          </TableRow>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>{selectedEvent?.description || ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total tickets</TableCell>
            <TableCell>{selectedEvent?.totalTickets || ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event begins</TableCell>
            <TableCell>{formatDateTime(selectedEvent?.beginsAt)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event ends</TableCell>
            <TableCell>{formatDateTime(selectedEvent?.endsAt)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ticket sale begins </TableCell>
            <TableCell>
              {formatDateTime(selectedEvent?.ticketSaleBegins)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
}
