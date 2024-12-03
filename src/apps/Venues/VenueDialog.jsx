import {
  TextField,
  DialogContent,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function EventDialog({ venue, handleChange }) {
  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  

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
            label="Venue name"
            value={venue.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            name="address"
            label="Venue address"
            value={venue.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            required
            name="zipcode"
            label="Venue zipcode"
            type="number"
            value={venue.zipcode}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
    </div>
  );
}
