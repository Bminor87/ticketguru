import { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import {
  TextField,
  DialogContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fi";

export default function EventDialog({ event, handleChange }) {
  const { fetchVenues } = useApiService();
  const [venues, setVenues] = useState([]);

  const handleDateChange = (name, newValue) => {
    handleChange({
      // Here we convert datetime object to ISO8601 string, so we can set it to the event state
      target: { name, value: newValue.toISOString() },
    });
  };

  const getVenues = async () => {
    try {
      const fetchedVenues = await fetchVenues();
      setVenues(fetchedVenues);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVenues();
  }, []);

  return (
    <div>
      <DialogContent>
        <Stack spacing={2} width={500}>
          <TextField
            autoFocus
            required
            name='name'
            label='Event name'
            value={event.name}
            onChange={handleChange}
          />
          <TextField
            required
            name='description'
            label='Event description'
            value={event.description}
            onChange={handleChange}
          />
          <TextField
            required
            name='totalTickets'
            label='Total tickets'
            type='number'
            value={event.totalTickets}
            onChange={handleChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='fi'>
            <DateTimePicker
              required
              name='beginsAt'
              label='Event begin *'
              value={
                // Here we convert ISO8601 string to datetime object, so we can place it to MUI datetime picker
                event.beginsAt ? dayjs(event.beginsAt) : null
              }
              onChange={(newValue) => handleDateChange("beginsAt", newValue)}
            />
            <DateTimePicker
              required
              name='endsAt'
              label='Event end *'
              value={
                // Here we convert ISO8601 string to datetime object, so we can place it to MUI datetime picker
                event.endsAt ? dayjs(event.endsAt) : null
              }
              onChange={(newValue) => handleDateChange("endsAt", newValue)}
            />
            <DateTimePicker
              name='ticketSaleBegins'
              label='Ticket sale begin'
              value={
                // Here we convert ISO8601 string to datetime object, so we can place it to MUI datetime picker
                event.ticketSaleBegins ? dayjs(event.ticketSaleBegins) : null
              }
              onChange={(newValue) =>
                handleDateChange("ticketSaleBegins", newValue)
              }
            />
          </LocalizationProvider>
          <FormControl fullWidth variant='standard' required>
            <InputLabel id='venue'>Venue</InputLabel>
            <Select
              labelId='venueId'
              name='venueId'
              value={event.venueId}
              onChange={handleChange}>
              {/*This map function lists all venues a dropdown menu */}
              {/*This way we can select a venue directly from the list */}
              {venues.map((venue) => (
                <MenuItem key={venue.id} value={venue.id}>
                  {venue.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
    </div>
  );
}
