import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import Button from "@mui/material/Button";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useApiService } from "../../service/ApiProvider";
import { useSettings } from "../../SettingsContext";
import AddTicketType from "./AddTicketType";
import EditTicketType from "./EditTicketType";
import DeleteTicketType from "./DeleteTicketType";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function TicketTypes({ currentEventId, currentEventName }) {
  const { darkMode } = useSettings(); // Access darkMode and API URL from settings
  const [eventTicketTypes, setEventTicketTypes] = useState([]);
  const { fetchTicketTypes } = useApiService();
  const [open, setOpen] = useState(false);

  const defaultColumnDefs = {
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "name", headerName: "Ticket type" },
    { field: "retailPrice", headerName: "Retail price €" },
    { field: "totalAvailable", headerName: "Total available" },
    {
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      width: 70,
      cellRenderer: (params) => (
        <EditTicketType currentTicketType={params.data} getEventTicketTypes={getEventTicketTypes}/>
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
        <DeleteTicketType
          currentTicketTypeId={params.data.id}
          currentEventId={currentEventId}
          getEventTicketTypes={getEventTicketTypes}
        />
      ),
    },
  ]);

  const handleOpen = () => {
    getEventTicketTypes(currentEventId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getEventTicketTypes = async (id) => {
    try {
      console.log("EventId: ", id);
      const eventTicketTypeData = await fetchTicketTypes({ eventId: id });
      setEventTicketTypes(eventTicketTypeData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        startIcon={<ConfirmationNumberIcon />}></Button>
      {/*We use Dialog to open ticket types table */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"md"}
        fullWidth={true}>
        <DialogTitle>Ticket types for {currentEventName}</DialogTitle>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <AddTicketType
            currentEventId={currentEventId}
            getEventTicketTypes={getEventTicketTypes}
          />
        </DialogActions>
        <DialogContent>
          <div
            className={`ag-theme-material ${
              darkMode ? "ag-theme-material-dark" : ""
            }`}
            style={{ height: "500px", width: "100%" }}>
            <AgGridReact
              rowData={eventTicketTypes}
              defaultColDef={defaultColumnDefs}
              columnDefs={columnDefs}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
