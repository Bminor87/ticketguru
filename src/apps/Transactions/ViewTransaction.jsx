import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useApiService } from "../../service/ApiProvider";
import TicketTable from "./TicketTable";

export default function ViewTransaction({ sale }) {
  const { fetchTickets } = useApiService();
  const [tickets, setTickets] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getTickets = async () => {
    try {
      const fetchedTickets = await fetchTickets(sale.ticketIds.toString());
      setTickets(fetchedTickets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <>
      <Button onClick={handleOpen} color="primary">
        VIEW
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Sale transaction {sale.id}:</DialogTitle>
        <DialogContent>
          <TicketTable tickets={tickets} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
