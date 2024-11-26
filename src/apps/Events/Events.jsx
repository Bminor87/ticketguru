import React, { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import { formatDateTime } from "../../util/helperfunctions";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchEvents } = useApiService();
  const [columnDefs, setColumnDefs] = useState([
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
    { field: "totalTickets", headerName: "Total tickets" },
    {
      field: "beginsAt",
      headerName: "Begins",
      valueFormatter: (params) => formatDateTime(params.value),
    },
    {
      field: "endsAt",
      headerName: "Ends",
      valueFormatter: (params) => formatDateTime(params.value),
    },
    {
      field: "ticketSaleBegins",
      headerName: "Ticket sale begins",
      valueFormatter: (params) => formatDateTime(params.value),
    },
    { field: "venueId", headerName: "Venue" },
  ]);

  // Fetch events data from an API or database
  const getEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch events the first time the component mounts
    getEvents();
  }, []);

  return (
    <div>
      <h1>Events</h1>
      {loading && <h1>Loading...</h1>}
      <div
        className='ag-theme-material'
        style={{ height: "500px", width: "100%" }}>
        <AgGridReact rowData={events} columnDefs={columnDefs} />
      </div>
    </div>
  );
}
