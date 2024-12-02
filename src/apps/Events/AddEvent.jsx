import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EventDialog from "./EventDialog";

export default function AddEvent({ getEvents }) {
  const [event, setEvent] = useState({
    name: "",
    description: "",
    totalTickets: "",
    beginsAt: "",
    endsAt: "",
    ticketSaleBegins: "",
    venueId: "",
  });

  const { addEvent } = useApiService();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
    setEvent({
      name: "",
      description: "",
      totalTickets: "",
      beginsAt: "",
      endsAt: "",
      ticketSaleBegins: "",
      venueId: "",
    });
  };

  const handleSave = async () => {
    await addEvent(event);
    await getEvents(true);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen} startIcon={<AddIcon />} variant="contained">Add event</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new event</DialogTitle>
        <EventDialog event={event} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
