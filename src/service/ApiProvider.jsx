import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSettings } from "../SettingsContext";

// Create the ApiContext
const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const settings = useSettings();
  const [errorMessage, setErrorMessage] = useState("");

  // Set up Axios authorization header
  useEffect(() => {
    const setAuthHeader = () => {
      console.log("Setting auth header for user:", settings.userName);
      const authToken = btoa(`${settings.userName}:${settings.userPass}`);
      axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;
    };
    setAuthHeader();
  }, [settings]);

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

  // Generalized API request function for reusable logic
  const makeApiCall = async (method, endpoint, data = {}, params = {}) => {
    const url = `${settings.url}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    console.log("Making API call to:", url);

    try {
      const response = await axios({
        method,
        url, // Use the properly constructed URL
        data,
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(
        `API call to ${endpoint} with params ${params} successful:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(`Error during API call to ${endpoint}:`, error);
      handleApiError(error);
      throw error; // Re-throw to handle further if needed
    }
  };

  // Specific API service functions
  const fetchEvents = async () => {
    try {
      const data = await makeApiCall("get", "/api/events");
      return data;
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchEvent = async (eventId) => {
    try {
      return await makeApiCall("get", `/api/events/${eventId}`);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const fetchTicket = async (barcode) => {
    try {
      const ticketData = await makeApiCall(
        "get",
        `/api/tickets/barcode/${barcode}`
      );
      return ticketData;
    } catch (error) {
      console.error("Error fetching ticket:", error);
    }
  };

  const fetchTickets = async (ticketIds) => {
    try {
      return await makeApiCall("get", `/api/tickets`, {}, { ids: ticketIds });
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchTicketType = async (ticketTypeId) => {
    try {
      return await makeApiCall("get", `/api/tickettypes/${ticketTypeId}`);
    } catch (error) {
      console.error("Error fetching ticket type:", error);
    }
  };

  const fetchExampleTicket = async () => {
    try {
      const tickets = await makeApiCall("get", "/api/tickets");
      return tickets[0]; // Return the first ticket
    } catch (error) {
      console.error("Error fetching example ticket:", error);
    }
  };

  const consumeTicket = async (barcode) => {
    try {
      return await makeApiCall("put", `/api/tickets/use/${barcode}`);
    } catch (error) {
      console.error("Error consuming ticket:", error);
    }
  };

  const releaseTicket = async (barcode) => {
    try {
      return await makeApiCall("put", `/api/tickets/use/${barcode}?used=false`);
    } catch (error) {
      console.error("Error releasing ticket:", error);
    }
  };

  const postBasketItems = async (basket) => {
    try {
      const ticketItems = basket.map((item) => ({
        ticketTypeId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));
      return await makeApiCall("post", "/api/sales/confirm", { ticketItems });
    } catch (error) {
      console.error("Error posting basket items:", error);
    }
  };

  const fetchTicketTypes = async (params) => {
    try {
      const ticketTypes = await makeApiCall(
        "get",
        "/api/tickettypes/search",
        {},
        params
      );
      console.log("Ticket types:", ticketTypes);
      return ticketTypes;
    } catch (error) {
      console.error("Error fetching ticket types:", error);
    }
  };

  return (
    <ApiContext.Provider
      value={{
        errorMessage,
        clearErrorMessage,
        fetchExampleTicket,
        fetchTicket,
        fetchTickets,
        fetchEvent,
        fetchEvents,
        fetchTicketType,
        consumeTicket,
        releaseTicket,
        postBasketItems,
        fetchTicketTypes,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the ApiContext
export const useApiService = () => useContext(ApiContext);
