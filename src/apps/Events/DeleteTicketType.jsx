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

export default function DeleteTicketType({
  currentTicketTypeId,
  currentEventId,
  getEventTicketTypes,
}) {
  const { deleteTicketType } = useApiService();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteTicketType(currentTicketTypeId);
    await getEventTicketTypes(currentEventId);
    handleClose();
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        color='error'
        startIcon={<DeleteIcon />}></Button>
      {/*We use Dialog instead of alert to confirm user's intent to delete the ticket type */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete ticket type</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the ticket type?
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
