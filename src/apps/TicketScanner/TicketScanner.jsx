import { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import { useSettings } from "../../SettingsContext";
import EventDropDown from "../../common/EventDropDown";
import Ticket from "../../common/Ticket";
import CorrectEventChecker from "../../common/CorrectEventChecker";
import BarcodeInput from "../../common/BarcodeInput";
import ErrorMessage from "../../common/ErrorMessage";
import { Modal, Box } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 480,
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function TicketScanner() {
  const settings = useSettings();
  const [barcode, setBarcode] = useState("");
  const [ticketMessage, setTicketMessage] = useState(
    "No ticket data available. Please scan a ticket."
  );

  const {
    fetchTicket,
    consumeTicket,
    releaseTicket,
    errorMessage,
    clearErrorMessage,
    fetchEvents,
  } = useApiService();

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [eventIdInTicket, setEventIdInTicket] = useState(0);
  const [ticketData, setTicketData] = useState(null);
  const [additionalData, setAdditionalData] = useState({
    event: null,
    ticketType: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [barcodeLoading, setBarcodeLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
    resetState();
  };

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents || []);
      setIsLoading(false);
    };
    loadEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (ticketData) {
      setEventIdInTicket(ticketData.event?.id || 0);
      clearErrorMessage();
    }
  }, [ticketData, clearErrorMessage]);

  const handleChange = (event) => setBarcode(event.target.value);

  const fetchTicketData = async (barcode) => {
    try {
      const response = await fetchTicket(barcode);
      if (!response) {
        throw new Error("No ticket data found");
      }
      setTicketData(response);
      await fetchAdditionalData(response);
      return response;
    } catch (error) {
      console.error("Error fetching ticket data:", error);
      setTicketData(null);
      clearErrorMessage();
      setTicketMessage("Ticket not found. Please try again.");
    }
  };

  const fetchAdditionalData = async (ticket) => {
    try {
      const event = {
        name: ticket.event?.name || "Unknown Event",
        time: ticket.event?.beginsAt || "Unknown Time",
        location: ticket.venue?.name || "Unknown Location",
      };
      const ticketType = ticket.ticketType?.name || "N/A";
      setAdditionalData({ event, ticketType });
    } catch (error) {
      console.error("Error fetching additional data:", error);
    }
  };

  const markTicketAsUsed = async () => {
    try {
      await consumeTicket(barcode);
      setTicketMessage("Ticket has been marked as used.");
      resetState();
    } catch (error) {
      console.error("Error marking ticket as used:", error);
    }
  };

  const markTicketAsUnused = async () => {
    try {
      await releaseTicket(barcode);
      setTicketMessage("Ticket has been marked as unused.");
      resetState();
    } catch (error) {
      console.error("Error marking ticket as unused:", error);
    }
  };

  const resetState = () => {
    setTicketData(null);
    setEventIdInTicket(0);
    setBarcode("");
    setIsCorrectEvent(false);
  };

  const [isCorrectEvent, setIsCorrectEvent] = useState(
    selectedEventId === eventIdInTicket
  );

  useEffect(() => {
    setIsCorrectEvent(selectedEventId === eventIdInTicket);
  }, [selectedEventId, eventIdInTicket]);

  const handleBarcodeRead = async (event) => {
    event.preventDefault();
    setBarcodeLoading(true);
    const response = await fetchTicketData(barcode);
    setBarcodeLoading(false);
    console.log("Response when trying to open modal", response);
    if (selectedEventId === response.event?.id) setOpenModal(true);
  };

  return (
    <div className="sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <p className="text-sm mb-4 text-gray-500 dark:text-white">
          Scan tickets for the selected event.
        </p>
        <div className="grid md-grid-cols-4 gap-4">
          {isLoading ? (
            <p>Loading events...</p>
          ) : (
            <EventDropDown
              selectedEventId={selectedEventId}
              setSelectedEventId={setSelectedEventId}
              events={events}
            />
          )}
          <BarcodeInput
            barcode={barcode}
            handleChange={handleChange}
            handleSubmit={handleBarcodeRead}
            barcodeLoading={barcodeLoading}
          />
        </div>
        <CorrectEventChecker
          selectedEventId={selectedEventId}
          eventIdInTicket={eventIdInTicket}
          isCorrectEvent={isCorrectEvent}
        />
        <ErrorMessage
          error={errorMessage}
          errorCode={settings.ticketUsedErrorCode}
        />

        <Modal open={openModal} onClose={handleClose}>
          <Box sx={style}>
            {ticketData ? (
              <>
                <Ticket
                  ticketData={ticketData}
                  additionalData={additionalData}
                />
                <button
                  onClick={
                    ticketData.usedAt ? markTicketAsUnused : markTicketAsUsed
                  }
                  className="mt-3 inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  {ticketData.usedAt ? "Mark as Unused" : "Mark as Used"}
                </button>
              </>
            ) : (
              <p>{ticketMessage}</p>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}
