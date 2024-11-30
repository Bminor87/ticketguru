import {
  TextField,
  DialogContent,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function TicketTypeDialog({ ticketType, handleChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      <DialogContent>
        <Stack
          spacing={2}
          width={isMobile ? "100%" : 500} // Adjust width for mobile
        >
          <TextField
            autoFocus
            required
            name="name"
            label="Ticket type name"
            value={ticketType.name || ""}
            onChange={handleChange}
            fullWidth // Ensure full width on all screens
          />
          <TextField
            required
            name="retailPrice"
            label="Retail price"
            type="number"
            value={ticketType.retailPrice || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="totalTickets"
            label="Total tickets"
            type="number"
            value={ticketType.totalTickets || ""}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
    </div>
  );
}
