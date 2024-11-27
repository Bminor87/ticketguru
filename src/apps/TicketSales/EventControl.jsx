import { Card, Box, Stack, Typography, Divider, Chip } from "@mui/material";
import { formatDateTime } from "../../util/helperfunctions";

export default function EventControl({ selectedEvent, venues }) {
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
          {selectedEvent.totalTickets || "0"} tickets available
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
            <Typography sx={{ color: "text.primary" }}>
              Tickets Open:
            </Typography>
            <Chip
              label={formatDateTime(selectedEvent.ticketSaleBegins)}
              color="info"
              size="small"
            />
          </div>
        </Stack>
      </Box>
    </Card>
  );
}
