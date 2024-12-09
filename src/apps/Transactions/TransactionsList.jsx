import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { useSettings } from "../../SettingsContext";
import { useApiService } from "../../service/ApiProvider";

export default function TransactionsList() {
  const { darkMode } = useSettings();
  const { fetchSales, fetchTickets } = useApiService();
  const [sales, setSales] = useState([]);

  const currencyFormatter = (value) => {
    return Number(value).toLocaleString("fi-FI", {
      style: "currency",
      currency: "EUR",
    });
  };

  const defaultColumnDefs = {
    filter: true,
    floatingFilter: true,
    sortable: true,
    resizable: true,
  };

  const getSales = async () => {
    try {
      const fetchedSales = await fetchSales();
      setSales(fetchedSales);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "paidAt", headerName: "Transaction date and time" },
    { field: "userId", headerName: "Sales Agent" },
    {
      field: "tickets",
      headerName: "Nr. Tickets Sold",
      valueGetter: (params) => params.data.ticketIds.length,
    },
    {
      field: "transactionSum",
      headerName: "Transaction Sum",
      valueFormatter: (params) =>
        currencyFormatter(params.data.transactionSum.toFixed(2)),
    },
  ]);

  const autoSizeStrategy = {
    type: "fitGridWidth",
    flex: 1,
  };

  return (
    <div
      className={`ag-theme-material ${
        darkMode ? "ag-theme-material-dark" : ""
      }`}
      style={{ minHeight: "500px", width: "100%" }}
    >
      <AgGridReact
        rowData={sales}
        defaultColDef={defaultColumnDefs}
        columnDefs={columnDefs}
        autoSizeStrategy={autoSizeStrategy}
      />
    </div>
  );
}
