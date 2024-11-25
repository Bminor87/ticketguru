import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function EventDropDown({
  selectedEventId,
  setSelectedEventId,
  events,
}) {
  const handleChange = (e) => {
    const eventId = parseInt(e.target.value, 10);
    setSelectedEventId(eventId);
  };

  return (
    <FormControl>
      <InputLabel>Event</InputLabel>
      <Select
        id="eventSelect"
        value={selectedEventId}
        onChange={handleChange}
        label="Event"
      >
        <MenuItem value={0}>Select an event</MenuItem>
        {events?.map((event) => (
          <MenuItem key={event.id} value={event.id}>
            {event.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
