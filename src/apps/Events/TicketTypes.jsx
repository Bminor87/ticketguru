import { useState, useEffect } from "react";
import { useApiService } from "../../service/ApiProvider";
import { useSettings } from "../../SettingsContext";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import AddTicketType from "./AddTicketType";
import EditTicketType from "./EditTicketType";
import DeleteTicketType from "./DeleteTicketType";
import { formatDateTime } from "../../util/helperfunctions";

export default function TicketTypes({ currentEventId, currentEventName }) {
  const { darkMode } = useSettings(); // Access darkMode and API URL from settings
  const [eventTicketTypes, setEventTicketTypes] = useState([]);
  const { fetchTicketTypes } = useApiService();
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const defaultColumnDefs = {
    filter: true,
    floatingFilter: !isMobile, // Hide floating filter on mobile
    sortable: true,
    resizable: true,
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "name", headerName: "Ticket type", flex: 1 },
    {
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      width: 70,
      cellRenderer: (params) => (
        <EditTicketType
          currentTicketType={params.data}
          getEventTicketTypes={getEventTicketTypes}
        />
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

  const fullColumns = [
    { field: "name", headerName: "Ticket type", flex: 1 },
    { field: "retailPrice", headerName: "Retail price €", flex: 1 },
    { field: "totalTickets", headerName: "Total tickets", flex: 1 },
    {
      field: "id",
      headerName: "",
      sortable: false,
      filter: false,
      resizable: false,
      width: 70,
      cellRenderer: (params) => (
        <EditTicketType
          currentTicketType={params.data}
          getEventTicketTypes={getEventTicketTypes}
        />
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
  ];

  const handleOpen = () => {
    getEventTicketTypes(currentEventId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getEventTicketTypes = async (id) => {
    try {
      const eventTicketTypeData = await fetchTicketTypes({ eventId: id });
      setEventTicketTypes(eventTicketTypeData);
    } catch (error) {
      console.error(error);
    }
  };

  // Adjust visible columns based on screen size
  useEffect(() => {
    setColumnDefs(isMobile ? columnDefs : fullColumns);
  }, [isMobile]);

  return (
    <div>
      <Button
        onClick={handleOpen}
        startIcon={<ConfirmationNumberIcon />}
        size={isMobile ? "small" : "medium"}
      ></Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={isMobile ? "xs" : "md"}
        fullWidth
      >
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
            style={{
              height: isMobile ? "300px" : "500px",
              width: "100%",
            }}
          >
            <AgGridReact
              rowData={eventTicketTypes}
              defaultColDef={defaultColumnDefs}
              columnDefs={columnDefs}
              domLayout={isMobile ? "autoHeight" : "normal"} // Adjust layout for mobile
              suppressHorizontalScroll={true}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} fullWidth={isMobile}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
