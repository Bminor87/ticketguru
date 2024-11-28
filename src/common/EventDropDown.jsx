import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  TextField,
  Autocomplete,
} from "@mui/material";

export default function EventDropDown({
  selectedEventId,
  setSelectedEventId,
  events,
}) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Get current date
    const now = new Date();

    // Filter and map events where endsAt > now
    const filteredOptions = events
      ?.filter(
        (event) =>
          new Date(event.endsAt) > now && new Date(event.ticketSaleBegins) < now
      ) // Filter events
      .map((event) => ({
        id: event.id,
        label: event.name,
        value: event.id,
      }));

    setOptions(filteredOptions || []);
  }, [events]);

  const handleChange = (event, newValue) => {
    if (newValue) {
      setSelectedEventId(newValue.id); // Set the selected event's ID
    } else {
      setSelectedEventId(0); // Handle deselection
    }
  };

  // Find the matching option based on selectedEventId
  const selectedOption =
    options.find((option) => option.id === selectedEventId) || null;

  return (
    <FormControl fullWidth>
      <InputLabel shrink>Event</InputLabel>
      <Autocomplete
        disablePortal
        options={options}
        value={selectedOption}
        onChange={handleChange}
        getOptionLabel={(option) => option.label} // Display label in dropdown
        isOptionEqualToValue={(option, value) => option.id === value.id} // Match options by ID
        renderInput={(params) => <TextField {...params} label="Event" />}
      />
    </FormControl>
  );
}
