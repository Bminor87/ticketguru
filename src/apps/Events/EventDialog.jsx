import { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import {
  TextField,
  DialogContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fi";

export default function EventDialog({ event, handleChange }) {
  const { fetchVenues } = useApiService();
  const [venues, setVenues] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDateChange = (name, newValue) => {
    handleChange({
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
        <Stack
          spacing={2}
          width={isMobile ? "100%" : 500} // Full-width on mobile
        >
          <TextField
            autoFocus
            required
            name="name"
            label="Event name"
            value={event.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            name="description"
            label="Event description"
            value={event.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            name="totalTickets"
            label="Total tickets"
            type="number"
            value={event.totalTickets}
            onChange={handleChange}
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
            <DateTimePicker
              required
              name="beginsAt"
              label="Event begin *"
              value={event.beginsAt ? dayjs(event.beginsAt) : null}
              onChange={(newValue) => handleDateChange("beginsAt", newValue)}
              fullWidth
            />
            <DateTimePicker
              required
              name="endsAt"
              label="Event end *"
              value={event.endsAt ? dayjs(event.endsAt) : null}
              onChange={(newValue) => handleDateChange("endsAt", newValue)}
              fullWidth
            />
            <DateTimePicker
              name="ticketSaleBegins"
              label="Ticket sale begin"
              value={
                event.ticketSaleBegins ? dayjs(event.ticketSaleBegins) : null
              }
              onChange={(newValue) =>
                handleDateChange("ticketSaleBegins", newValue)
              }
              fullWidth
            />
          </LocalizationProvider>
          <FormControl fullWidth required>
            <InputLabel id="venue">Venue</InputLabel>
            <Select
              labelId="venueId"
              name="venueId"
              value={event.venueId}
              onChange={handleChange}
            >
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
