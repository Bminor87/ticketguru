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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useApiService } from "../../service/ApiProvider";
import { useBasket } from "./BasketContext";

export default function TicketOrderControl({
  selectedEventId,
  selectedEventName,
  selectedTicketTypeId,
  setSelectedTicketTypeId,
}) {
  const { fetchTicketTypes } = useApiService();
  const { addToBasket } = useBasket();

  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(1);

  const params = new URLSearchParams([["eventId", selectedEventId]]);

  // Fetch ticket types when the selected event changes
  useEffect(() => {
    if (!selectedEventId) return;

    const getTicketTypes = async () => {
      try {
        setSelectedTicketTypeId(0); // Clear ticket type selection
        const fetchedTicketTypes = await fetchTicketTypes(params);
        setTicketTypes(fetchedTicketTypes || []);
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      }
    };

    getTicketTypes();
  }, [selectedEventId, fetchTicketTypes]);

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

    addToBasket(selectedTicketType, amount, price, selectedEventName);
  };

  const handlePriceChange = (e) =>
    setPrice(Math.max(0, Number(e.target.value)));
  const handleAmountChange = (e) =>
    setAmount(Math.max(1, parseInt(e.target.value, 10) || 1));

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Box>
        {/* Event Name */}
        <Typography variant="h6" gutterBottom>
          Ticket Types
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Ticket Types */}
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

        {/* Selected Ticket Details */}
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

        {/* Add to Basket Button */}
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedTicketType}
          onClick={handleAddToBasket}
          fullWidth
        >
          Add to Basket
        </Button>
      </Box>
    </Card>
  );
}
