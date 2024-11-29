import { TextField, DialogContent, Stack } from "@mui/material";

export default function TicketTypeDialog({ ticketType, handleChange }) {
  return (
    <div>
      <DialogContent>
        <Stack spacing={2} width={500}>
          <TextField
            autoFocus
            required
            name="name"
            label="Ticket type name"
            value={ticketType.name || ""}
            onChange={handleChange}
          />
          <TextField
            required
            name="retailPrice"
            label="Retail price"
            type="number"
            value={ticketType.retailPrice || ""}
            onChange={handleChange}
          />
          <TextField
            name="totalTickets"
            label="Total tickets"
            type="number"
            value={ticketType.totalTickets || ""}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
    </div>
  );
}
