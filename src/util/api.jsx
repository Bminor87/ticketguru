import axios from "axios";

const fetchEvents = async ({ url, userName, userPass }) => {
  try {
    const response = await fetch(url + "/events", {
      headers: {
        Authorization: `Basic ${btoa(`${userName}:${userPass}`)}`,
      },
    });

    if (!response.ok) {
      console.error("API error:", response.status, response.statusText);
      throw new Error("Failed to fetch events");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

const fetchTicketTypes = async (settings, params) => {
  const { url, userName, userPass } = settings;
  try {
    const response = await axios.get(`${url}/tickettypes/search`, {
      headers: {
        Authorization: `Basic ${btoa(`${userName}:${userPass}`)}`,
      },
      params: params,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching ticket types: ", error);
  }
};

const postBasketItems = async (settings, basket) => {
  const { url, userName, userPass } = settings;
  const ticketItems = basket.map((item) => ({
    ticketTypeId: item.id,
    quantity: item.quantity,
    price: item.price,
  }));
  try {
    const response = await axios.post(
      `${url}/sales/confirm`,
      { ticketItems },
      {
        headers: {
          Authorization: `Basic ${btoa(`${userName}:${userPass}`)}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response; // return the whole response object to access the status code
  } catch (error) {
    console.error("Error posting basket items: ", error);
  }
};

const fetchTickets = async (settings, ticketIds) => {
  const { url, userName, userPass } = settings;
  try {
    const response = await axios.get(`${url}/tickets`, {
      headers: {
        Authorization: `Basic ${btoa(`${userName}:${userPass}`)}`,
      },
      params: { ids: ticketIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket information: ", error);
  }
};

export { fetchEvents, fetchTicketTypes, postBasketItems, fetchTickets };
