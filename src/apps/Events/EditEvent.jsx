import { useState } from "react";

import EventDialog from "./EventDialog";
import { useApiService } from "../../service/ApiProvider";

import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

export default function EditEvent({ currentEvent, getEvents }) {
  const [event, setEvent] = useState(currentEvent);
  const [open, setOpen] = useState(false);
  const { updateEvent } = useApiService();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    console.log(event);
    await updateEvent(event.id, event);
    await getEvents(true);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen} startIcon={<EditIcon />}></Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit event</DialogTitle>
        <EventDialog event={event} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
