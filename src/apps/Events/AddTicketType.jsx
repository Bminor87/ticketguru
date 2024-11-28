import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import TicketTypeDialog from "./TicketTypeDialog";

export default function AddTicketType({ currentEventId, getEventTicketTypes }) {
  const [ticketType, setTicketType] = useState({
    name: "",
    retailPrice: "",
    totalAvailable: "",
    eventId: currentEventId,
  });

  const [open, setOpen] = useState(false);

  const { addTicketType } = useApiService();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setTicketType({ ...ticketType, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
    setTicketType({
      ...ticketType,
      name: "",
      retailPrice: "",
      totalAvailable: "",
    });
  };

  const handleSave = async () => {
    await addTicketType(ticketType);
    await getEventTicketTypes(currentEventId);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add ticket type</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a new ticket type</DialogTitle>
        <TicketTypeDialog ticketType={ticketType} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
