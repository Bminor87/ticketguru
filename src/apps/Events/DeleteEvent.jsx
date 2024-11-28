import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteEvent({ currentEventId, getEvents }) {
  const { deleteEvent } = useApiService();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteEvent(currentEventId);
    await getEvents(true);
    handleClose();
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        color='error'
        startIcon={<DeleteIcon />}></Button>
      {/*We use Dialog instead of alert to confirm user's intent to delete the event */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete event</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the event?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
