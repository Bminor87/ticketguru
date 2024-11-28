import { useState } from "react";

import TicketTypeDialog from "./TicketTypeDialog";
import { useApiService } from "../../service/ApiProvider";

import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

export default function EditTicketType({
  currentTicketType,
  getEventTicketTypes,
}) {
  const [ticketType, setTicketType] = useState(currentTicketType);
  const [open, setOpen] = useState(false);
  const { updateTicketType } = useApiService();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setTicketType({ ...ticketType, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    await updateTicketType(ticketType.id, ticketType);
    await getEventTicketTypes(ticketType.eventId);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen} startIcon={<EditIcon />}></Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit ticket type</DialogTitle>
        <TicketTypeDialog ticketType={ticketType} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
