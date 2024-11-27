import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import Button from "@mui/material/Button";
import EventDialog from "./EventDialog";

export default function AddEvent({ getEvents }) {
  const [event, setEvent] = useState({
    name: "",
    description: "",
    totalTickets: 0,
    beginsAt: "",
    endsAt: "",
    ticketSaleBegins: "",
    venueId: "",
  });
  const { fetchEvents, addEvent } = useApiService();

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
      totalTickets: 0,
      beginsAt: "",
      endsAt: "",
      ticketSaleBegins: "",
      venueId: "",
    });
  };

  const handleSave = async () => {
    console.log(event);
    await addEvent(event);
    await getEvents(true);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add event</Button>
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
