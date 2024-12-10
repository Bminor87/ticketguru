import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useApiService } from "../../service/ApiProvider";

export default function ViewTransaction({ sale }) {
  const { fetchTickets } = useApiService();
  const [tickets, setTickets] = useState([]);
  const gridApiRef = useRef(null); // Ref to store grid API

  const onGridReady = (params) => {
    gridApiRef.current = params.api; // Store grid API in ref
    setRowData(tickets); // Set initial row data
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getTickets = async () => {
    try {
      const fetchedTickets = await fetchTickets(sale.ticketIds.toString());
      setTickets(fetchedTickets);
    } catch (error) {
      console.error(error);
    }
  };

  const columnDefs = [];
  const gridOptions = {
    columnDefs: columnDefs,
  };

  function dynamicallyConfigureColumnsFromObject(anObject) {
    const colDefs = gridOptions.api.getColumnDefs();
    colDefs.length = 0;
    const keys = Object.keys(anObject);
    keys.forEach((key) => colDefs.push({ field: key }));
    gridOptions.api.setColumnDefs(colDefs);
  }

  const updateGridData = (newData) => {
    if (gridApiRef.current) {
      gridApiRef.current.setRowData(newData);
    }
  };

  useEffect(() => {
    getTickets();
    dynamicallyConfigureColumnsFromObject(tickets[0]);
    updateGridData(tickets);
  }, []);

  return (
    <>
      <Button onClick={handleOpen} color="primary">
        VIEW
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sale transaction {sale.id}:</DialogTitle>
        <DialogContent>
          <AgGridReact gridOptions={gridOptions} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
