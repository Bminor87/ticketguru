import { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import { useSettings } from "../../SettingsContext";
import EventDropDown from "../../common/EventDropDown";
import Ticket from "../../common/Ticket";
import CorrectEventChecker from "../../common/CorrectEventChecker";
import BarcodeInput from "../../common/BarcodeInput";
import ErrorMessage from "../../common/ErrorMessage";
import { Modal, Box } from "@mui/material";

import TicketViewer from "../TicketSales/TicketViewer";

import { PDFViewer } from "@react-pdf/renderer";

import {
  findEvent,
  findTicketType,
  findVenue,
} from "../../util/helperfunctions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "320px",
  width: "100%",
  maxWidth: "1024px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  overflow: "scroll",
  maxHeight: "100vh",
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
    fetchAllTicketTypes,
    fetchVenues,
    fetchCity,
  } = useApiService();

  const [events, setEvents] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [eventIdInTicket, setEventIdInTicket] = useState(0);
  const [ticketData, setTicketData] = useState(null);
  const [additionalData, setAdditionalData] = useState({
    event: null,
    ticketType: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [reprintRequested, setReprintRequested] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
    resetState();
  };

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      const fetchedEvents = await fetchEvents();
      const fetchedTicketTypes = await fetchAllTicketTypes();
      const fetchedVenues = await fetchVenues();
      setTicketTypes(fetchedTicketTypes || []);
      setVenues(fetchedVenues || []);
      setEvents(fetchedEvents || []);
      setIsLoading(false);
    };
    loadEvents();
  }, [fetchEvents, fetchAllTicketTypes, fetchVenues]);

  useEffect(() => {
    if (ticketData) {
      setEventIdInTicket(
        findTicketType(ticketData.ticketTypeId, ticketTypes)?.eventId || 0
      );
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
      setTicketData(null);
      clearErrorMessage();
      setTicketMessage("Ticket not found. Please try again.");
    }
  };

  const fetchAdditionalData = async (ticket) => {
    try {
      const TheTicketType = findTicketType(ticket.ticketTypeId, ticketTypes);
      const TheEvent = findEvent(TheTicketType.eventId, events);
      const TheVenue = findVenue(TheEvent.venueId, venues);

      const city = await fetchCity(TheVenue.zipcode);

      const event = {
        name: TheEvent?.name || "Unknown Event",
        time: TheEvent?.beginsAt || "Unknown Time",
        location: TheVenue?.name || "Unknown Location",
        address: TheVenue?.address || "Unknown Address",
        zipcode: TheVenue?.zipcode || "Unknown Zipcode",
        city: city || "Unknown City",
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
    setReprintRequested(false);
  };

  const [isCorrectEvent, setIsCorrectEvent] = useState(
    selectedEventId === eventIdInTicket
  );

  useEffect(() => {
    setIsCorrectEvent(selectedEventId === eventIdInTicket);
  }, [selectedEventId, eventIdInTicket]);

  const handleBarcodeRead = async (event = null) => {
    console.log("Reading Barcode...", event, barcode);
    event?.preventDefault();
    const currentBarcode = event?.barcode || barcode;
    setBarcodeLoading(true);
    const response = await fetchTicketData(currentBarcode);
    console.log("Ticket data fetched after reading barcode:", response);
    setBarcodeLoading(false);
    if (
      selectedEventId ===
      findTicketType(response?.ticketTypeId, ticketTypes)?.eventId
    )
      setOpenModal(true);
  };

  return (
    <div className="sm:rounded-lg overflow-y-auto max-h-screen">
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
            setBarcode={setBarcode}
            handleChange={handleChange}
            handleSubmit={handleBarcodeRead}
            barcodeLoading={barcodeLoading}
          />
        </div>
        <CorrectEventChecker
          selectedEventId={selectedEventId}
          eventIdInTicket={eventIdInTicket}
          isCorrectEvent={isCorrectEvent}
          events={events}
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
                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  {(settings?.role == "TICKET_INSPECTOR" ||
                    settings?.role == "ADMIN") && (
                    <button
                      onClick={() =>
                        ticketData.usedAt
                          ? markTicketAsUnused()
                          : markTicketAsUsed()
                      }
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      {ticketData.usedAt ? "Mark as Unused" : "Mark as Used"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setReprintRequested(true);
                      setOpenModal(false);
                    }}
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
                  >
                    Reprint Ticket
                  </button>
                </div>
              </>
            ) : (
              <p>{ticketMessage}</p>
            )}
          </Box>
        </Modal>
        {reprintRequested && (
          <PDFViewer width="100%" height="600px">
            <TicketViewer
              tickets={[ticketData]}
              events={events}
              venues={venues}
              ticketTypes={ticketTypes}
            />
          </PDFViewer>
        )}
      </div>
    </div>
  );
}
