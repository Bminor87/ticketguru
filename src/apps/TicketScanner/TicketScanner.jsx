import { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import { useSettings } from "../../SettingsContext";
import EventDropDown from "./EventDropDown";
import Ticket from "../../common/Ticket";
import CorrectEventChecker from "../../common/CorrectEventChecker";
import BarcodeInput from "../../common/BarcodeInput";
import ErrorMessage from "../../common/ErrorMessage";
import ExampleBarcode from "./ExampleBarcode";

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
  } = useApiService();
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [eventIdInTicket, setEventIdInTicket] = useState(0);
  const [ticketData, setTicketData] = useState(null);
  const [additionalData, setAdditionalData] = useState({
    event: null,
    ticketType: null,
  });

  useEffect(() => {
    // Fetch an example ticket on load
    fetchExampleTicket().then((data) => setExample(data));
  }, []);

  useEffect(() => {
    if (ticketData != null) {
      if (ticketData.eventId) {
        setEventIdInTicket(ticketData.eventId);
      } else {
        setEventIdInTicket(ticketData.event?.id);
      }
      clearErrorMessage(); // Clear any error once data is fetched
    }
  }, [ticketData]);

  const handleChange = (event) => {
    setBarcode(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchTicketData(barcode);
    }
  };

  const fetchTicketData = async (barcode) => {
    try {
      const response = await fetchTicket(barcode);
      setTicketData(response.data);
      await fetchAdditionalData(response.data);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  const fetchAdditionalData = async (ticket) => {
    console.log("Fetching additional data for ticket", ticket);
    try {
      const event = {
        name: ticket.event?.name,
        time: ticket.event?.beginsAt,
        location: ticket.venue?.name,
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
      resetState();
    } catch (error) {
      console.error("Error marking ticket as used:", error);
    }
  };

  const markTicketAsUnused = async () => {
    try {
      await releaseTicket(barcode);
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
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <p className="text-sm text-gray-500 dark:text-white">
          Scan tickets for the selected event.
        </p>
        <EventDropDown
          selectedEventId={selectedEventId}
          setSelectedEventId={setSelectedEventId}
        />
        <BarcodeInput
          barcode={barcode}
          handleChange={handleChange}
          handleKeyPress={handleKeyPress}
        />
        <CorrectEventChecker
          selectedEventId={selectedEventId}
          eventIdInTicket={eventIdInTicket}
          isCorrectEvent={isCorrectEvent}
        />
        <ErrorMessage
          error={errorMessage}
          errorCode={settings.ticketUsedErrorCode}
        />
        {ticketData && isCorrectEvent && !ticketData.used && (
          <div className="mt-5">
            <Ticket ticketData={ticketData} additionalData={additionalData} />
            <button
              onClick={markTicketAsUsed}
              className="mt-3 inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Mark as Used
            </button>
          </div>
        )}
        {ticketData && isCorrectEvent && ticketData.used && (
          <div className="mt-5">
            <Ticket ticketData={ticketData} additionalData={additionalData} />
            <button
              onClick={markTicketAsUnused}
              className="mt-3 inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Mark as Unused
            </button>
          </div>
        )}
        <ExampleBarcode
          example={example}
          barcodeProperty={settings.barcodeProperty}
          setBarcode={setBarcode}
          fetchTicketData={fetchTicketData}
        />
      </div>
    </div>
  );
}
