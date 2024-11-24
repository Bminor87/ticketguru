import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSettings } from "../SettingsContext";

// Create the ApiContext
const ApiContext = createContext();

// Define the ApiProvider component
export const ApiProvider = ({ children }) => {
  const settings = useSettings();
  const [errorMessage, setErrorMessage] = useState("");

  // Set authorization header
  const setAuthHeader = () => {
    console.log("Setting auth header for user:", settings.userName);
    const authToken = btoa(`${settings.userName}:${settings.userPass}`);
    axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;
  };

  useEffect(() => {
    setAuthHeader();
  }, []);

  // Error handling function
  const handleApiError = (error) => {
    if (error.response) {
      setErrorMessage(error.response.data.message);
    } else if (error.request) {
      setErrorMessage("No response received from the server.");
    } else {
      setErrorMessage("An unexpected error occurred. Is the server up?");
    }
  };

  // Function to clear the error message
  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  // API service functions
  const fetchExampleTicket = async () => {
    try {
      const response = await axios.get(`${settings.url}/api/tickets`);
      return response.data[0];
    } catch (error) {
      console.error("Error fetching example ticket data:", error);
      handleApiError(error);
    }
  };

  const fetchTicket = async (barcode) => {
    try {
      const response = await axios.get(
        `${settings.url}/api/tickets/${settings.barcodeProperty}/${barcode}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching ticket data:", error);
      handleApiError(error);
    }
  };

  const fetchEvent = async (eventId) => {
    try {
      const response = await axios.get(`${settings.url}/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      handleApiError(error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${settings.url}/api/events`);
      return response.data.map((event) => ({
        eventId: event.id,
        eventName: event.name,
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
      handleApiError(error);
    }
  };

  const fetchTicketType = async (ticketTypeId) => {
    try {
      const response = await axios.get(
        `${settings.url}/api/ticket-types/${ticketTypeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching ticket type:", error);
      handleApiError(error);
    }
  };

  const consumeTicket = async (barcode) => {
    try {
      const response = await axios.put(
        `${settings.url}/api/tickets/use/${barcode}`
      );
      return response.data;
    } catch (error) {
      console.error("Error consuming ticket:", error);
      handleApiError(error);
    }
  };

  const releaseTicket = async (barcode) => {
    try {
      const response = await axios.put(
        `${settings.url}/api/tickets/use/${barcode}?used=false`
      );
      return response.data;
    } catch (error) {
      console.error("Error releasing ticket:", error);
      handleApiError(error);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        errorMessage,
        clearErrorMessage,
        fetchExampleTicket,
        fetchTicket,
        fetchEvent,
        fetchEvents,
        fetchTicketType,
        consumeTicket,
        releaseTicket,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the ApiContext
export const useApiService = () => useContext(ApiContext);
