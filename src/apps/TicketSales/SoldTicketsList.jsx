import { useEffect, useState } from "react";
import { useSettings } from "../../SettingsContext";

import {
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";

import { useApiService } from "../../service/ApiProvider";
import { formatDateTime } from "../../util/helperfunctions";

import Ticket from "./Ticket";

export default function SoldTicketsList({ soldTicketsData }) {
  const [tickets, setTickets] = useState([]);
  const settings = useSettings();

  const { fetchTickets } = useApiService();

  useEffect(() => {
    if (!soldTicketsData) return;
    const getTickets = async () => {
      try {
        const ticketIds = soldTicketsData.ticketIds.toString();
        const fetchedTickets = await fetchTickets(settings, ticketIds);
        setTickets(fetchedTickets);
      } catch (error) {
        console.error(error);
      }
    };
    getTickets();
  }, [soldTicketsData]);

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
          {/* <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Ticket type</TableCell>
                <TableCell>Venue</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Barcode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket, index) => (
                <TableRow key={index}>
                  <TableCell>{ticket.event.name}</TableCell>
                  <TableCell>{ticket.ticketType.name}</TableCell>
                  <TableCell>{ticket.venue.name}</TableCell>
                  <TableCell>{ticket.price.toFixed(2)}</TableCell>
                  <TableCell>{ticket.barcode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}
          <PDFViewer width="100%" height="600px">
            <Ticket tickets={tickets} />
          </PDFViewer>
        </>
      )}
    </>
  );
}
