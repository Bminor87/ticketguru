import React, { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider"; // Assume similar service for fetching venues
import { useSettings } from "../../SettingsContext";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import AddVenue from "./AddVenue"; // Import venue-specific components
import EditVenue from "./EditVenue";
import DeleteVenue from "./DeleteVenue";

const Venues = () => {
  const { darkMode } = useSettings(); 
  const [venues, setVenues] = useState([]);
  const { fetchVenues } = useApiService();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const defaultColumnDefs = {
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "name", headerName: "Name" },
    { field: "address", headerName: "Address" },
    { field: "zipcode", headerName: "Zipcode" },
    {
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      width: 70,
      cellRenderer: (params) => (
        <EditVenue currentVenue={params.data} getVenues={getVenues} />
      ),
    },
    {
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      width: 70,
      cellRenderer: (params) => (
        <DeleteVenue currentVenueId={params.data.id} getVenues={getVenues} />
      ),
    },
  ]);

  const fullColumns = [
    { field: "name", headerName: "Name" },
    { field: "address", headerName: "Address" },
    { field: "zipcode", headerName: "Zipcode" },
    {
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      width: 70,
      cellRenderer: (params) => (
        <EditVenue currentVenue={params.data} getVenues={getVenues} />
      ),
    },{
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params) => (
        <DeleteVenue currentVenueId={params.data.id} getVenues={getVenues} />
      ),
    },
  ];

  useEffect(() => {
    setColumnDefs(isMobile ? columnDefs : fullColumns);
  }, [isMobile]);

  const getVenues = async () => {
    try {
      const fetchedVenues = await fetchVenues();
      setVenues(fetchedVenues);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getVenues();
  }, []);

  return (
    <div>
      <AddVenue getVenues={getVenues} />
      <div
        className={`ag-theme-material ${
          darkMode ? "ag-theme-material-dark" : ""
        }`}
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={venues}
          defaultColDef={defaultColumnDefs}
          columnDefs={columnDefs}
          context={{ venues }}
        />
      </div>
    </div>
  );
};

export default Venues;
