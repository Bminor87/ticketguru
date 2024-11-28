import React, { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import { formatDateTime } from "../../util/helperfunctions";
import { useSettings } from "../../SettingsContext";

import AddEvent from "./AddEvent";
import EditEvent from "./EditEvent";
import DeleteEvent from "./DeleteEvent";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function Events() {
  const { darkMode } = useSettings(); // Access darkMode and API URL from settings
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const { fetchEvents, fetchVenues } = useApiService();
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
    {
      headerName: "Venue",
      valueGetter: (params) => {
        const venue = params.context.venues?.find(
          (v) => v.id === params.data.venueId
        );
        return venue?.name;
      },
    },
    {
      field: "id",
      headerName: "",
      cellRenderer: (params) => (
        <EditEvent currentEvent={params.data} getEvents={getEvents} />
      ),
    },
    {
      field: "id",
      headerName: "",
      cellRenderer: (params) => (
        <DeleteEvent currentEventId={params.data.id} getEvents={getEvents} />
      ),
    },
  ]);

  // Fetch events data from an API or database
  const getEvents = async (trueOrFalse) => {
    try {
      const fetchedEvents = await fetchEvents(trueOrFalse);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error(error);
    }
  };

  const getVenues = async () => {
    try {
      const fetchedVenues = await fetchVenues();
      setVenues(fetchedVenues);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch events and venues the first time the component mounts
    getEvents(false);
    getVenues();
  }, []);

  return (
    <div>
      <AddEvent getEvents={getEvents} />
      <div
        className={`ag-theme-material ${
          darkMode ? "ag-theme-material-dark" : ""
        }`}
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={events}
          columnDefs={columnDefs}
          context={{ venues }}
        />
      </div>
    </div>
  );
}
