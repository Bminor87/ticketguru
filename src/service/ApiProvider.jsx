import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSettings } from "../SettingsContext";

// Create the ApiContext
const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const settings = useSettings();
  const [errorMessage, setErrorMessage] = useState("");
  const [events, setEvents] = useState(null); // State for events
  const [venues, setVenues] = useState(null); // State for venues

  useEffect(() => {
    const setAuthHeader = () => {
      console.log("Setting auth header for user:", settings.userName);
      const authToken = btoa(`${settings.userName}:${settings.userPass}`);
      axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;
    };
    setAuthHeader();
  }, [settings]);

  const handleApiError = (error) => {
    if (error.response) {
      setErrorMessage(error.response.data.message);
    } else if (error.request) {
      setErrorMessage("No response received from the server.");
    } else {
      setErrorMessage("An unexpected error occurred. Is the server up?");
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const makeApiCall = async (method, endpoint, data = {}, params = {}) => {
    const url = `${settings.url}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    console.log("Making API call to:", url);

    try {
      const response = await axios({
        method,
        url,
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
      throw error;
    }
  };

  // Specific API service functions

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
    console.log("Posting basket items:", basket);
    try {
      const ticketItems = basket.flatMap((item) => ({
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

  const fetchEvents = async (forceRefresh = false) => {
    if (!events || forceRefresh) {
      try {
        const data = await makeApiCall("get", "/api/events");
        setEvents(data); // Cache events
        return data;
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    return events;
  };

  const addEvent = async (event) => {
    try {
      await makeApiCall("post", "api/events", event);
      fetchEvents(true);
    } catch (error) {
      console.error("Error posting event: ", error);
    }
  };

  const updateEvent = async (id, event) => {
    try {
      await makeApiCall("put", `api/events/${id}`, event);
      fetchEvents(true);
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  const fetchVenues = async (forceRefresh = false) => {
    if (!venues || forceRefresh) {
      try {
        const data = await makeApiCall("get", "/api/venues");
        setVenues(data); // Update the cache
        return data;
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    }
    return venues;
  };

  const fetchVenue = async (venueId) => {
    try {
      return await makeApiCall("get", `/api/venues/${venueId}`);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const login = async (email, password) => {
    console.log("Using the ApiProvider's Login", email, password);
    const authToken = btoa(`${email}:${password}`); // Encode credentials for Basic Auth

    try {
      // Use an existing protected endpoint for credential validation
      const response = await axios.get(`${settings.url}/api/events`, {
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      // Save user credentials in SettingsContext
      settings.setUserName(email);
      settings.setUserPass(password);

      // Save user credentials in localStorage for persistence
      localStorage.setItem(
        "user",
        JSON.stringify({ userName: email, userPass: password })
      );

      // Set the global Axios Authorization header
      axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;

      console.log("Login successful");
      return response.data; // Return data from the validated endpoint
    } catch (error) {
      console.error("Login failed:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error("Invalid credentials. Please try again.");
      } else {
        throw new Error(
          "An error occurred during login. Please try again later."
        );
      }
    }
  };

  const logout = () => {
    console.log("Logging out the user");

    // Clear credentials from SettingsContext
    settings.setUserName(null);
    settings.setUserPass(null);

    // Remove user credentials from localStorage
    localStorage.removeItem("user");

    // Remove the global Axios Authorization header
    delete axios.defaults.headers.common["Authorization"];

    // Optional: Redirect to the login page
    window.location.href = "/login";
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
        addEvent,
        updateEvent,
        fetchTicketType,
        consumeTicket,
        releaseTicket,
        postBasketItems,
        fetchTicketTypes,
        fetchVenues,
        fetchVenue,
        login,
        logout,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the ApiContext
export const useApiService = () => useContext(ApiContext);
