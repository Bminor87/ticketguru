
import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import VenueDialog from "./VenueDialog";

export default function AddVenue({ getVenues }) {
  const [venue, setVenue] = useState({
    name: "",
    address: "",
    zipcode: "",
  });

  const { addVenue } = useApiService();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setVenue({ ...venue, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
    setVenue({
      name: "",
      address: "",
      zipcode: "",
    });
  };

  const handleSave = async () => {
    await addVenue(venue);
    await getVenues(true);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen} startIcon={<AddIcon />} variant="contained">Add venue</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new venue</DialogTitle>
        <VenueDialog venue={venue} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
