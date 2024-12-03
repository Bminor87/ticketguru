import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VenueDialog from "./VenueDialog";

export default function EditVenue({ currentVenue, getVenues }) {
  const [venue, setVenue] = useState(currentVenue);
  const [open, setOpen] = useState(false);
  const { updateVenue } = useApiService();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setVenue({ ...venue, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    await updateVenue(venue.id, venue);
    await getVenues(true);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen} startIcon={<EditIcon />}></Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit venue</DialogTitle>
        <VenueDialog venue={venue} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
