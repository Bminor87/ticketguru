import { useEffect, useState } from "react";
import { Card, Box, Stack, Typography, Divider, Chip } from "@mui/material";
import { formatDateTime } from "../../util/helperfunctions";

import { useApiService } from "../../service/ApiProvider";

export default function EventControl({ selectedEvent, venues }) {
  const { fetchReport } = useApiService();

  const [ticketsSold, setTicketsSold] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await fetchReport();
        if (stats) {
          let sold = 0;
          stats.forEach((stat) => {
            if (stat.eventId === selectedEvent.id) {
              sold += stat.ticketsSold;
            }
          });
          setTicketsSold(sold);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    loadData();
  }, [selectedEvent]);

  if (!selectedEvent) {
    return (
      <Typography variant="body1" align="center">
        No event selected.
      </Typography>
    );
  }

  return (
    <Card variant="outlined" sx={{ width: "100%", mx: "auto", p: 2 }}>
      {/* Event Name and Tickets Available */}
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {selectedEvent.name}
          </Typography>
          <Typography
            gutterBottom
            variant="body2"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {venues?.find((venue) => venue.id === selectedEvent.venueId)?.name}
          </Typography>
        </Stack>
        {/* Event Description */}
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {selectedEvent.description || "No description available."}
        </Typography>
      </Box>

      {/* Divider */}
      <Divider />

      {/* Event Times */}
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant="h6" color="success">
          Tickets available: {selectedEvent.totalTickets - ticketsSold} /{" "}
          {selectedEvent.totalTickets || "0"}
        </Typography>
        <p>&nbsp;</p>
        <Stack direction="column" spacing={1}>
          <div className="flex justify-between align-between">
            <Typography sx={{ color: "text.primary" }}>Begins:</Typography>
            <Chip
              label={formatDateTime(selectedEvent.beginsAt)}
              color="primary"
              size="small"
            />
          </div>

          <div className="flex justify-between align-between">
            <Typography sx={{ color: "text.primary" }}>Ends:</Typography>
            <Chip
              label={formatDateTime(selectedEvent.endsAt)}
              color="secondary"
              size="small"
            />
          </div>

          <div className="flex justify-between align-between">
            <Typography sx={{ color: "text.primary" }}>Sale Opens:</Typography>
            <Chip
              label={formatDateTime(selectedEvent.ticketSaleBegins) || "TBA"}
              color="info"
              size="small"
            />
          </div>
        </Stack>
      </Box>
    </Card>
  );
}
