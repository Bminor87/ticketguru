import { TextField, DialogContent, Stack } from "@mui/material";

export default function TicketTypeDialog({ ticketType, handleChange }) {

    
  return (
    <div>
      <p>{ticketType.id}</p>
      <DialogContent>
        <Stack spacing={2} width={500}>
          <TextField
            autoFocus
            required
            name='name'
            label='Ticket type name'
            value={ticketType.name}
            onChange={handleChange}
          />
          <TextField
            required
            name='retailPrice'
            label='Retail price'
            type='number'
            value={ticketType.retailPrice}
            onChange={handleChange}
          />
          <TextField
            name='totalAvailable'
            label='Total available'
            type='number'
            value={ticketType.totalAvailable}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
    </div>
  );
}
