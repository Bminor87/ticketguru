import { useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TicketTypeDialog from "./TicketTypeDialog";

export default function EditTicketType({
  currentTicketType,
  getEventTicketTypes,
}) {
  const [ticketType, setTicketType] = useState(currentTicketType);
  const [open, setOpen] = useState(false);
  const { updateTicketType } = useApiService();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Button
        onClick={handleOpen}
        startIcon={<EditIcon />}
        size={isMobile ? "small" : "medium"} // Adjust button size for mobile
      ></Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={isMobile ? "xs" : "sm"} // Adjust dialog size for mobile
        fullWidth
      >
        <DialogTitle>Edit ticket type</DialogTitle>
        <TicketTypeDialog ticketType={ticketType} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose} fullWidth={isMobile}>
            Cancel
          </Button>
          <Button onClick={handleSave} fullWidth={isMobile}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
