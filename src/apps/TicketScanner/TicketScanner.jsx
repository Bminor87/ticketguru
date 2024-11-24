import { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import { useSettings } from "../../SettingsContext";
import EventDropDown from "../../common/EventDropDown";
import Ticket from "../../common/Ticket";
import CorrectEventChecker from "../../common/CorrectEventChecker";
import BarcodeInput from "../../common/BarcodeInput";
import ErrorMessage from "../../common/ErrorMessage";
import ExampleBarcode from "./ExampleBarcode";
import PopupMessage from "../../common/PopupMessage";
import { Button } from "@mui/material";

export default function TicketScanner() {
  const settings = useSettings();
  const [example, setExample] = useState(null);
  const [barcode, setBarcode] = useState("");

  const {
    fetchExampleTicket,
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

  const [popupOpened, setPopupOpened] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    let isMounted = true;
    const getExampleTicket = async () => {
      try {
        const data = await fetchExampleTicket();
        if (isMounted) setExample(data);
      } catch (error) {
        console.error("Error fetching example ticket:", error);
      }
    };
    getExampleTicket();
    return () => {
      isMounted = false;
    };
  }, [fetchExampleTicket]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        console.log("Fetching events...");
        const fetchedEvents = await fetchEvents();
        console.log("Fetched events:", fetchedEvents); // Log fetched events
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    getEvents();
  }, []); // Fetch events on component mount

  useEffect(() => {
    if (ticketData != null) {
      console.log("Ticket data:", ticketData);
      setEventIdInTicket(ticketData.event?.id || 0);
      clearErrorMessage();
    }
  }, [ticketData, clearErrorMessage]);

  const handleChange = (event) => setBarcode(event.target.value);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchTicketData(barcode);
    }
  };

  const fetchTicketData = async (barcode) => {
    try {
      const response = await fetchTicket(barcode);
      const ticket = response;
      console.log("Fetched ticket DATATATATATATAAA:", ticket);
      if (!ticket) throw new Error("Ticket data is empty");
      setTicketData(ticket);
      await fetchAdditionalData(ticket);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
      clearErrorMessage();
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
      setPopupOpened(true);
      setPopupType("success");
      setPopupTitle("Ticket Used");
      setPopupMessage("The ticket has been successfully marked as used.");
      resetState();
    } catch (error) {
      console.error("Error marking ticket as used:", error);
    }
  };

  const markTicketAsUnused = async () => {
    try {
      await releaseTicket(barcode);
      setPopupOpened(true);
      setPopupType("success");
      setPopupTitle("Ticket Unused");
      setPopupMessage("The ticket has been successfully marked as unused.");
      resetState();
    } catch (error) {
      console.error("Error marking ticket as unused:", error);
    }
  };

  const resetState = () => {
    setTicketData(null);
    setEventIdInTicket(0);
    setBarcode("");
  };

  const isCorrectEvent = selectedEventId === eventIdInTicket;

  return (
    <div className="sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <p className="text-sm mb-4 text-gray-500 dark:text-white">
          Scan tickets for the selected event.
        </p>
        <div className="grid grid-cols-4 gap-4">
          <EventDropDown
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            events={events}
          />
          <BarcodeInput
            barcode={barcode}
            handleChange={handleChange}
            handleKeyPress={handleKeyPress}
          />
          <Button variant="contained" onClick={() => fetchTicketData(barcode)}>
            Fetch Ticket
          </Button>
        </div>
        <CorrectEventChecker
          selectedEventId={selectedEventId}
          eventIdInTicket={eventIdInTicket}
          isCorrectEvent={isCorrectEvent}
        />
        <PopupMessage
          type={popupType}
          title={popupTitle}
          message={popupMessage}
          opened={popupOpened}
        />
        <ErrorMessage
          error={errorMessage}
          errorCode={settings.ticketUsedErrorCode}
        />
        {ticketData && isCorrectEvent && (
          <div className="mt-5">
            <Ticket ticketData={ticketData} additionalData={additionalData} />
            <button
              onClick={
                ticketData.usedAt ? markTicketAsUnused : markTicketAsUsed
              }
              className="mt-3 inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              {ticketData.usedAt ? "Mark as Unused" : "Mark as Used"}
            </button>
          </div>
        )}
        <ExampleBarcode
          example={example}
          setBarcode={setBarcode}
          fetchTicketData={fetchTicketData}
        />
      </div>
    </div>
  );
}
