import React, { useState, useEffect } from "react";
import { useSettings } from "../../SettingsContext";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

const Venues = () => {
  const { darkMode } = useSettings();
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    // Fetch data from an API or define it statically
    const fetchData = async () => {
      const data = await fetch("/api/venues").then((res) => res.json());
      setRowData(data);
    };
    fetchData();
  }, []);

  const handleEdit = (id) => {
    // Handle edit logic here
    console.log(`Edit venue with id: ${id}`);
  };

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Location", field: "location", sortable: true, filter: true },
    { headerName: "Capacity", field: "capacity", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "id",
      cellRendererFramework: (params) => (
        <button onClick={() => handleEdit(params.value)}>Edit</button>
      ),
    },
  ];

  return (
    <div
      className={`ag-theme-material ${
        darkMode ? "ag-theme-material-dark" : ""
      }`}
      style={{ height: "500px", width: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default Venues;
