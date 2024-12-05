import {
  Button,
  Stack,
  TextField,
  InputAdornment,
  Card,
  Box,
  Chip,
  Divider,
  Typography,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { useBasket } from "./BasketContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  width: "50%",
  maxWidth: 1024,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TicketOrderControl({
  selectedEvent,
  selectedTicketTypeId,
  setSelectedTicketTypeId,
}) {
  const { fetchTicketTypes, fetchReport } = useApiService();
  const { addToBasket } = useBasket();

  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(1);

  const [open, setOpen] = useState(false);
  const [printOutAmounts, setPrintOutAmounts] = useState({});
  const [remainingTickets, setRemainingTickets] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(null);

  const params = new URLSearchParams([["eventId", selectedEvent?.id]]);

  // Fetch tickets sold for the selected event
  const countTicketsSold = async () => {
    try {
      const stats = await fetchReport();
      if (stats) {
        const sold = stats
          .filter((stat) => stat.eventId === selectedEvent?.id)
          .reduce((total, stat) => total + stat.ticketsSold, 0);
        setTicketsSold(sold);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  // Fetch ticket types when the selected event changes
  useEffect(() => {
    if (!selectedEvent) return;

    const getTicketTypes = async () => {
      try {
        setSelectedTicketTypeId(0); // Clear ticket type selection
        const fetchedTicketTypes = await fetchTicketTypes(params);
        setTicketTypes(fetchedTicketTypes || []);
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      }
    };

    countTicketsSold();
    getTicketTypes();
  }, [selectedEvent, fetchTicketTypes]);

  // Update selected ticket type details
  useEffect(() => {
    if (selectedTicketTypeId) {
      const ticketType = ticketTypes.find(
        (type) => type.id === selectedTicketTypeId
      );
      setSelectedTicketType(ticketType || null);
      setPrice(ticketType?.retailPrice || 0);
      setAmount(1);
    } else {
      setSelectedTicketType(null);
      setPrice(0);
      setAmount(1);
    }
  }, [selectedTicketTypeId, ticketTypes]);

  // Handle adding to basket
  const handleAddToBasket = () => {
    if (!selectedTicketType) {
      alert("Please select an event and a ticket type!");
      return;
    }
    addToBasket(selectedTicketType, amount, price, selectedEvent?.name);
  };

  // Recount remaining tickets
  const recountRemainingTickets = (
    currentPrintOutAmounts = printOutAmounts
  ) => {
    let remaining = (selectedEvent?.totalTickets || 0) - (ticketsSold || 0);
    Object.values(currentPrintOutAmounts).forEach((amount) => {
      remaining -= amount;
    });
    setRemainingTickets(remaining);
  };

  // Open print tickets modal
  const openPrintRemainingTicketsModal = () => {
    const initialPrintOutAmounts = ticketTypes.reduce((acc, ticketType) => {
      acc[ticketType.id] = Math.min(
        ticketType.availableTickets,
        (selectedEvent?.totalTickets || 0) - (ticketsSold || 0)
      );
      return acc;
    }, {});
    setPrintOutAmounts(initialPrintOutAmounts);
    recountRemainingTickets(initialPrintOutAmounts);
    setOpen(true);
  };

  const closePrintRemainingTicketsModal = () => {
    setOpen(false);
    setPrintOutAmounts({});
    setRemainingTickets(0);
  };

  const printRemainingTickets = () => {
    Object.entries(printOutAmounts).forEach(([ticketTypeId, amount]) => {
      const ticketType = ticketTypes.find(
        (type) => type.id === parseInt(ticketTypeId, 10)
      );

      if (amount === 0) return;

      addToBasket(ticketType, amount, 0, selectedEvent?.name);
    });
    setOpen(false);
  };

  // Handle input changes for ticket print amounts
  const handleChangePrintOutAmount = (e, ticketType) => {
    const val = Math.min(
      Math.max(0, parseInt(e.target.value, 10) || 0),
      ticketType.availableTickets
    );

    const updatedPrintOutAmounts = {
      ...printOutAmounts,
      [ticketType.id]: val,
    };

    setPrintOutAmounts(updatedPrintOutAmounts);
    recountRemainingTickets(updatedPrintOutAmounts);
  };

  const handlePriceChange = (e) =>
    setPrice(Math.max(0, Number(e.target.value)));
  const handleAmountChange = (e) =>
    setAmount(Math.max(1, parseInt(e.target.value, 10) || 1));

  return (
    <>
      <Card variant="outlined" sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Ticket Types
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {ticketTypes.length === 0 && (
            <Typography variant="body1" gutterBottom>
              No ticket types available
            </Typography>
          )}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
            {ticketTypes.map((ticketType) => (
              <Chip
                key={ticketType.id}
                label={ticketType.name}
                color={
                  ticketType.id === selectedTicketTypeId ? "primary" : "default"
                }
                onClick={() => setSelectedTicketTypeId(ticketType.id)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Stack>

          {selectedTicketType && (
            <>
              <Typography variant="body1" gutterBottom>
                {selectedTicketType.name} - {selectedTicketType.retailPrice} €
              </Typography>
              <Typography variant="body2" gutterBottom>
                {selectedTicketType.availableTickets} tickets available
              </Typography>
              <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                <TextField
                  label="Price"
                  type="number"
                  value={price}
                  onChange={handlePriceChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">tickets</InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            disabled={!selectedTicketType}
            onClick={handleAddToBasket}
            fullWidth
          >
            Add to Basket
          </Button>
          <Button
            style={{ marginTop: "10px" }}
            variant="contained"
            color="secondary"
            onClick={openPrintRemainingTicketsModal}
            disabled={ticketTypes.length === 0}
            fullWidth
          >
            Print out remaining tickets
          </Button>
        </Box>
      </Card>

      <Modal open={open} onClose={closePrintRemainingTicketsModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">
            Remaining tickets for {selectedEvent?.name} <br />
            <span
              className={
                remainingTickets === 0
                  ? "text-green-500"
                  : remainingTickets < 0
                  ? "text-red-500"
                  : "text-yellow-500"
              }
            >
              {remainingTickets}
            </span>
            {" / "}
            {selectedEvent?.totalTickets || 0}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Table sx={{ marginBottom: "20px" }}>
            <TableHead>
              <TableRow>
                <TableCell>Ticket Type</TableCell>
                <TableCell>Amount to print</TableCell>
                <TableCell>Set to remaining</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ticketTypes.map((ticketType) => (
                <TableRow key={ticketType.id}>
                  <TableCell>{ticketType.name}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={printOutAmounts[ticketType.id] || 0}
                      onChange={(e) =>
                        handleChangePrintOutAmount(e, ticketType)
                      }
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: ticketType.availableTickets,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleChangePrintOutAmount(
                          {
                            target: {
                              value:
                                printOutAmounts[ticketType.id] +
                                remainingTickets,
                            },
                          },
                          ticketType
                        )
                      }
                    >
                      Set
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            variant="contained"
            color="primary"
            onClick={closePrintRemainingTicketsModal}
          >
            Cancel
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            variant="contained"
            color="secondary"
            onClick={printRemainingTickets}
            disabled={remainingTickets !== 0}
          >
            Print
          </Button>
        </Box>
      </Modal>
    </>
  );
}
