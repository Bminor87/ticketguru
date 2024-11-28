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
  const [ticketTypes, setTicketTypes] = useState(null); // State for ticket types
  const [dirt, setDirt] = useState({
    events: false,
    venues: false,
    ticketTypes: false,
  });

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

  // Event API calls
  const fetchEvent = async (eventId) => {
    try {
      return await makeApiCall("get", `/api/events/${eventId}`);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const fetchEvents = async () => {
    if (!events || dirt.events) {
      try {
        const data = await makeApiCall("get", "/api/events");
        setEvents(data); // Cache events
        setDirt({ ...dirt, events: false });
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
      setDirt({ ...dirt, events: true });
    } catch (error) {
      console.error("Error posting event: ", error);
    }
  };

  const updateEvent = async (id, event) => {
    try {
      await makeApiCall("put", `api/events/${id}`, event);
      setDirt({ ...dirt, events: true });
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await makeApiCall("delete", `api/events/${id}`);
      setDirt({ ...dirt, events: true });
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  // Ticket type API calls
  const fetchTicketType = async (ticketTypeId) => {
    try {
      return await makeApiCall("get", `/api/tickettypes/${ticketTypeId}`);
    } catch (error) {
      console.error("Error fetching ticket type:", error);
    }
  };

  const fetchAllTicketTypes = async () => {
    if (!ticketTypes || dirt.ticketTypes) {
      try {
        const ticketTypes = await makeApiCall("get", "/api/tickettypes");
        console.log("Ticket types:", ticketTypes);
        setTicketTypes(ticketTypes); // Update the cache
        setDirt({ ...dirt, ticketTypes: false });
        return ticketTypes;
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      }
    }
    return ticketTypes;
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

  const addTicketType = async (ticketType) => {
    try {
      await makeApiCall("post", "/api/tickettypes", ticketType);
      setDirt({ ...dirt, ticketTypes: true });
    } catch (error) {
      console.error("Error posting ticket type: ", error);
    }
  };

  const updateTicketType = async (id, ticketType) => {
    try {
      await makeApiCall("put", `api/tickettypes/${id}`, ticketType);
      setDirt({ ...dirt, ticketTypes: true });
    } catch (error) {
      console.error("Error updating ticket type: ", error);
    }
  };

  const deleteTicketType = async (id) => {
    try {
      await makeApiCall("delete", `api/tickettypes/${id}`);
      setDirt({ ...dirt, ticketTypes: true });
    } catch (error) {
      console.error("Error deleting ticket ytpe: ", error);
    }
  };

  // Venue API calls
  const fetchVenue = async (venueId) => {
    try {
      return await makeApiCall("get", `/api/venues/${venueId}`);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchVenues = async () => {
    if (!venues || dirt.venues) {
      try {
        const data = await makeApiCall("get", "/api/venues");
        setVenues(data); // Update the cache
        setDirt({ ...dirt, venues: false });
        return data;
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    }
    return venues;
  };

  const addVenue = async (venue) => {
    try {
      await makeApiCall("post", "api/venues", venue);
      setDirt({ ...dirt, venues: true });
    } catch (error) {
      console.error("Error posting venue: ", error);
    }
  };

  const updateVenue = async (id, venue) => {
    try {
      await makeApiCall("put", `api/venues/${id}`, venue);
      setDirt({ ...dirt, venues: true });
    } catch (error) {
      console.error("Error updating venue: ", error);
    }
  };

  const deleteVenue = async (id) => {
    try {
      await makeApiCall("delete", `api/venues/${id}`);
      setDirt({ ...dirt, venues: true });
    } catch (error) {
      console.error("Error deleting venue: ", error);
    }
  };

  // Ticket API calls
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

  const fetchExampleTicket = async () => {
    try {
      const tickets = await makeApiCall("get", "/api/tickets");
      return tickets[0]; // Return the first ticket
    } catch (error) {
      console.error("Error fetching example ticket:", error);
    }
  };

  const fetchTickets = async (ticketIds = []) => {
    try {
      if (!ticketIds || ticketIds.length === 0) {
        return await makeApiCall("get", `/api/tickets`);
      }
      return await makeApiCall("get", `/api/tickets`, {}, { ids: ticketIds });
    } catch (error) {
      console.error("Error fetching tickets:", error);
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

  // Login API calls
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
        // Error
        errorMessage,
        clearErrorMessage,

        // Event API calls
        fetchEvent,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,

        // Ticket type API calls
        fetchTicketType,
        fetchTicketTypes,
        fetchAllTicketTypes,
        addTicketType,
        updateTicketType,
        deleteTicketType,

        // Venue API calls
        fetchVenue,
        fetchVenues,
        addVenue,
        updateVenue,
        deleteVenue,

        // Ticket API cals
        fetchTicket,
        fetchExampleTicket,
        fetchTickets,
        consumeTicket,
        releaseTicket,
        postBasketItems,

        // Login
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
