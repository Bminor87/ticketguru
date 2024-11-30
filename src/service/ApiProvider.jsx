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
  const [users, setUsers] = useState(null); // State for users
  const [roles, setRoles] = useState(null); // State for roles

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
      fetchEvents(true); // Force refresh
    } catch (error) {
      console.error("Error posting event: ", error);
    }
  };

  const updateEvent = async (id, event) => {
    try {
      await makeApiCall("put", `api/events/${id}`, event);
      fetchEvents(true); // Force refresh
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await makeApiCall("delete", `api/events/${id}`);
      fetchEvents(true); // Force refresh
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

  const fetchAllTicketTypes = async (forceRefresh = false) => {
    if (!ticketTypes || forceRefresh) {
      try {
        const ticketTypes = await makeApiCall("get", "/api/tickettypes");
        console.log("Ticket types:", ticketTypes);
        setTicketTypes(ticketTypes); // Update the cache
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
      fetchAllTicketTypes(true); // Force refresh
    } catch (error) {
      console.error("Error posting ticket type: ", error);
    }
  };

  const updateTicketType = async (id, ticketType) => {
    try {
      await makeApiCall("put", `api/tickettypes/${id}`, ticketType);
      fetchAllTicketTypes(true); // Force refresh
    } catch (error) {
      console.error("Error updating ticket type: ", error);
    }
  };

  const deleteTicketType = async (id) => {
    try {
      await makeApiCall("delete", `api/tickettypes/${id}`);
      fetchAllTicketTypes(true); // Force refresh
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

  const addVenue = async (venue) => {
    try {
      await makeApiCall("post", "api/venues", venue);
      fetchVenues(true); // Force refresh
    } catch (error) {
      console.error("Error posting venue: ", error);
    }
  };

  const updateVenue = async (id, venue) => {
    try {
      await makeApiCall("put", `api/venues/${id}`, venue);
      fetchVenues(true); // Force refresh
    } catch (error) {
      console.error("Error updating venue: ", error);
    }
  };

  const deleteVenue = async (id) => {
    try {
      await makeApiCall("delete", `api/venues/${id}`);
      fetchVenues(true); // Force refresh
    } catch (error) {
      console.error("Error deleting venue: ", error);
    }
  };

  // User API calls
  const fetchUser = async (userId) => {
    try {
      return await makeApiCall("get", `/api/users/${userId}`);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchUsers = async (forceRefresh = false) => {
    if (!users || forceRefresh) {
      try {
        const data = await makeApiCall("get", "/api/users");
        setUsers(data); // Cache users
        return data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    return users;
  };

  const addUser = async (user) => {
    try {
      user.roleId = user.role?.id; // Convert role object to roleId
      await makeApiCall("post", "api/users", user);
      fetchUsers(true); // Refresh
    } catch (error) {
      console.error("Error posting user: ", error);
    }
  };

  const updateUser = async (id, user) => {
    try {
      user.roleId = user.role?.id; // Convert role object to roleId
      await makeApiCall("put", `api/users/${id}`, user);
      fetchUsers(true); // Refresh
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await makeApiCall("delete", `api/users/${id}`);
      fetchUsers(true); // Refresh
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const fetchRoles = async (forceRefresh = false) => {
    if (!roles || forceRefresh) {
      try {
        const data = await makeApiCall("get", "/api/roles");
        setRoles(data); // Cache roles
        return data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }
    return roles;
  };

  // Sales API calls

  const fetchSales = async () => {
    try {
      return await makeApiCall("get", "/api/sales");
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchSale = async (saleId) => {
    try {
      return await makeApiCall("get", `/api/sales/${saleId}`);
    } catch (error) {
      console.error("Error fetching sale:", error);
    }
  };

  const fetchReport = async () => {
    try {
      return await makeApiCall("get", "/api/sales/report");
    } catch (error) {
      console.error("Error fetching report:", error);
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
      throw error;
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

        // User API calls
        fetchUser,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser,
        fetchRoles,

        // Ticket API cals
        fetchTicket,
        fetchExampleTicket,
        fetchTickets,
        consumeTicket,
        releaseTicket,

        // Sales API calls
        fetchSales,
        fetchSale,
        fetchReport,
        postBasketItems,

        // Login
        login,
        logout,

        // Data
        events,
        venues,
        ticketTypes,
        users,
        roles,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use the ApiContext
export const useApiService = () => useContext(ApiContext);
